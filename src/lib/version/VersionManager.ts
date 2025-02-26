import semver from 'semver';
import { Lock } from './Lock';
import { supabase } from '../supabase';

export class VersionManager {
  private currentVersion: string;
  private lock: Lock;
  private lastShownVersion: string | null;
  private autoIncrementEnabled: boolean;

  constructor(initialVersion: string = '0.1.0') {
    if (!initialVersion || !semver.valid(initialVersion)) {
      console.warn(`Invalid version format: ${initialVersion}, using default`);
      initialVersion = '0.1.0';
    }
    this.currentVersion = initialVersion;
    this.lock = new Lock();
    this.autoIncrementEnabled = true;
    
    try {
      this.lastShownVersion = localStorage.getItem('changelog_last_shown_version');
    } catch (error) {
      console.warn('Failed to read last shown version:', error);
      this.lastShownVersion = null;
    }
  }

  async incrementVersion(type: 'major' | 'minor' | 'patch'): Promise<string> {
    await this.lock.acquire();
    try {
      const newVersion = semver.inc(this.currentVersion, type);
      if (!newVersion) {
        throw new Error('Failed to increment version');
      }

      // Update version in database
      const { error } = await supabase
        .from('changelog')
        .insert({
          version: newVersion,
          type: 'changed',
          message: `Version bumped to ${newVersion}`,
          date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        throw new Error(`Failed to record version change: ${error.message}`);
      }

      this.currentVersion = newVersion;
      return newVersion;
    } finally {
      this.lock.release();
    }
  }

  validateVersion(version: string): boolean {
    return Boolean(version && semver.valid(version));
  }

  compareVersions(v1: string, v2: string): number {
    if (!this.validateVersion(v1) || !this.validateVersion(v2)) {
      throw new Error('Invalid version format');
    }
    return semver.compare(v1, v2);
  }

  getCurrentVersion(): string {
    return this.currentVersion;
  }

  shouldShowChangelog(): boolean {
    if (!this.lastShownVersion) return true;
    
    try {
      // Use semver for proper version comparison
      return semver.gt(this.currentVersion, this.lastShownVersion);
    } catch (error) {
      console.error('Version comparison error:', error);
      return true; // Show changelog on error to be safe
    }
  }

  markChangelogShown(): void {
    try {
      localStorage.setItem('changelog_last_shown_version', this.currentVersion);
      this.lastShownVersion = this.currentVersion;
      console.log(`Changelog marked as shown for version ${this.currentVersion}`);
    } catch (error) {
      console.error('Failed to mark changelog as shown:', error);
    }
  }

  setAutoIncrement(enabled: boolean): void {
    this.autoIncrementEnabled = enabled;
  }

  async getVersionHistory(): Promise<{ version: string; date: string }[]> {
    try {
      const { data, error } = await supabase
        .from('changelog')
        .select('version, date')
        .order('date', { ascending: false })
        .order('version', { ascending: false });

      if (error) {
        console.error('Failed to fetch version history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch version history:', error);
      return [];
    }
  }

  async getLatestVersion(): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('changelog')
        .select('version')
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No entries found, return current version
          return this.currentVersion;
        }
        throw error;
      }

      return data?.version || this.currentVersion;
    } catch (error) {
      console.error('Failed to fetch latest version:', error);
      return this.currentVersion;
    }
  }

  async trackChange(type: 'added' | 'changed' | 'fixed', message: string): Promise<string> {
    await this.lock.acquire();
    try {
      let newVersion = this.currentVersion;
      
      if (this.autoIncrementEnabled) {
        // Determine version increment type based on change type
        let incrementType: 'major' | 'minor' | 'patch';
        
        switch (type) {
          case 'added':
            incrementType = 'minor'; // New features increment minor version
            break;
          case 'changed':
          case 'fixed':
            incrementType = 'patch'; // Changes and fixes increment patch version
            break;
          default:
            incrementType = 'patch';
        }
        
        newVersion = semver.inc(this.currentVersion, incrementType) || this.currentVersion;
      }
      
      // Record change in database
      const { error } = await supabase
        .from('changelog')
        .insert({
          version: newVersion,
          type,
          message,
          date: new Date().toISOString().split('T')[0]
        });
        
      if (error) {
        throw new Error(`Failed to record change: ${error.message}`);
      }
      
      this.currentVersion = newVersion;
      return newVersion;
    } finally {
      this.lock.release();
    }
  }
}