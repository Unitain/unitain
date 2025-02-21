import semver from 'semver';
import { Lock } from './Lock';

export class VersionManager {
  private currentVersion: string;
  private lock: Lock;
  private lastShownVersion: string | null;

  constructor(initialVersion: string = '0.1.0') {
    if (!initialVersion || !semver.valid(initialVersion)) {
      console.warn(`Invalid version format: ${initialVersion}, using default`);
      initialVersion = '0.1.0';
    }
    this.currentVersion = initialVersion;
    this.lock = new Lock();
    
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
}