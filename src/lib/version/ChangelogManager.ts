import { supabase } from '../supabase';
import { nanoid } from 'nanoid';
import { VersionManager } from './VersionManager';
import { Lock } from './Lock';

export type ChangelogEntryType = 'added' | 'changed' | 'fixed';

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  type: ChangelogEntryType;
  message: string;
}

interface CacheEntry {
  entry: ChangelogEntry;
  timestamp: number;
}

/**
 * Manages changelog entries with Supabase integration and local caching.
 */
export class ChangelogManager {
  private cache: Map<string, CacheEntry>;
  private lock: Lock;
  private cacheTimeout: number;
  private retryAttempts: number;
  private retryDelay: number;
  private initialized: boolean;
  private versionManager: VersionManager;

  constructor(
    cacheTimeout = 5 * 60 * 1000, // 5 minutes
    retryAttempts = 3,
    retryDelay = 1000
  ) {
    this.cache = new Map();
    this.lock = new Lock();
    this.cacheTimeout = cacheTimeout;
    this.retryAttempts = retryAttempts;
    this.retryDelay = retryDelay;
    this.initialized = false;
    this.versionManager = new VersionManager();
  }

  /**
   * Initialize the changelog manager and verify database connection.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.lock.acquire();
      
      // Verify database connection and table existence
      const { error } = await supabase
        .from('changelog')
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === '42P01') { // Table does not exist
          throw new Error('Changelog table not found. Please ensure migrations have been run.');
        }
        throw error;
      }

      this.initialized = true;
      console.debug('ChangelogManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ChangelogManager:', error);
      throw error;
    } finally {
      this.lock.release();
    }
  }

  /**
   * Add a new changelog entry with retry logic.
   */
  async addEntry(
    version: string,
    type: ChangelogEntryType,
    message: string,
    attempt = 0
  ): Promise<ChangelogEntry> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      await this.lock.acquire();

      if (!this.versionManager.validateVersion(version)) {
        throw new Error(`Invalid version format: ${version}`);
      }

      const entry: Omit<ChangelogEntry, 'id'> = {
        version,
        type,
        message: message.trim(),
        date: new Date().toISOString().split('T')[0],
      };

      const { data, error } = await supabase
        .from('changelog')
        .insert([entry])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newEntry = data as ChangelogEntry;
      this.updateCache(newEntry);

      return newEntry;
    } catch (error) {
      console.error(`Failed to add changelog entry (attempt ${attempt + 1}):`, error);

      if (attempt < this.retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * Math.pow(2, attempt)));
        return this.addEntry(version, type, message, attempt + 1);
      }

      throw error;
    } finally {
      this.lock.release();
    }
  }

  /**
   * Get changelog entries for a specific version with caching.
   */
  async getEntriesForVersion(version: string): Promise<ChangelogEntry[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Check cache first
      const cachedEntries = Array.from(this.cache.entries())
        .filter(([_, { entry, timestamp }]) => {
          const isCacheValid = Date.now() - timestamp < this.cacheTimeout;
          const isVersionMatch = entry.version === version;
          return isCacheValid && isVersionMatch;
        })
        .map(([_, { entry }]) => entry);

      if (cachedEntries.length > 0) {
        return cachedEntries;
      }

      const { data, error } = await supabase
        .from('changelog')
        .select('*')
        .eq('version', version)
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      const entries = data as ChangelogEntry[];
      entries.forEach(entry => this.updateCache(entry));

      return entries;
    } catch (error) {
      console.error('Failed to get changelog entries:', error);
      throw error;
    }
  }

  /**
   * Get all changelog entries grouped by version.
   */
  async getAllEntries(): Promise<Record<string, ChangelogEntry[]>> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const { data, error } = await supabase
        .from('changelog')
        .select('*')
        .order('version', { ascending: false })
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      return (data as ChangelogEntry[]).reduce((acc, entry) => {
        if (!acc[entry.version]) {
          acc[entry.version] = [];
        }
        acc[entry.version].push(entry);
        return acc;
      }, {} as Record<string, ChangelogEntry[]>);
    } catch (error) {
      console.error('Failed to get all changelog entries:', error);
      throw error;
    }
  }

  /**
   * Generate markdown changelog for a specific version.
   */
  async generateChangelog(version: string): Promise<string> {
    const entries = await this.getEntriesForVersion(version);
    if (entries.length === 0) return '';

    const grouped = this.groupEntriesByType(entries);
    return this.formatChangelog(version, grouped);
  }

  /**
   * Export complete changelog to markdown format.
   */
  async exportToMarkdown(): Promise<string> {
    try {
      const groupedEntries = await this.getAllEntries();
      
      return Object.entries(groupedEntries)
        .map(([version, entries]) => 
          this.formatChangelog(version, this.groupEntriesByType(entries))
        )
        .join('\n\n');
    } catch (error) {
      console.error('Failed to export changelog:', error);
      throw error;
    }
  }

  /**
   * Update the local cache with a new entry.
   */
  private updateCache(entry: ChangelogEntry): void {
    this.cache.set(entry.id, {
      entry,
      timestamp: Date.now()
    });

    // Clean up expired cache entries
    for (const [id, { timestamp }] of this.cache.entries()) {
      if (Date.now() - timestamp > this.cacheTimeout) {
        this.cache.delete(id);
      }
    }
  }

  /**
   * Group changelog entries by type.
   */
  private groupEntriesByType(
    entries: ChangelogEntry[]
  ): Record<ChangelogEntryType, string[]> {
    return entries.reduce((acc, entry) => {
      if (!acc[entry.type]) {
        acc[entry.type] = [];
      }
      acc[entry.type].push(entry.message);
      return acc;
    }, {} as Record<ChangelogEntryType, string[]>);
  }

  /**
   * Format changelog entries into markdown.
   */
  private formatChangelog(
    version: string,
    grouped: Record<ChangelogEntryType, string[]>
  ): string {
    const date = new Date().toISOString().split('T')[0];
    let markdown = `## [${version}] - ${date}\n\n`;

    for (const type of ['added', 'changed', 'fixed'] as ChangelogEntryType[]) {
      if (grouped[type]?.length > 0) {
        markdown += `### ${type.charAt(0).toUpperCase() + type.slice(1)}\n`;
        grouped[type].forEach(message => {
          markdown += `- ${message}\n`;
        });
        markdown += '\n';
      }
    }

    return markdown.trim();
  }

  /**
   * Clean up resources and close connections.
   */
  async cleanup(): Promise<void> {
    try {
      await this.lock.acquire();
      this.cache.clear();
      this.initialized = false;
    } finally {
      this.lock.release();
    }
  }
}