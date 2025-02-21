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
    return semver.gt(this.currentVersion, this.lastShownVersion);
  }

  markChangelogShown(): void {
    try {
      localStorage.setItem('changelog_last_shown_version', this.currentVersion);
      this.lastShownVersion = this.currentVersion;
    } catch (error) {
      console.error('Failed to mark changelog as shown:', error);
    }
  }

  setAutoIncrement(enabled: boolean): void {
    this.autoIncrementEnabled = enabled;
  }

  async getVersionHistory(): Promise<{ version: string; date: string }[]> {
    const { data, error } = await supabase
      .from('changelog')
      .select('version, date')
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch version history: ${error.message}`);
    }

    return data;
  }
}