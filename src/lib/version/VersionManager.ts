import semver from 'semver';
import { Lock } from './Lock';

/**
 * Manages semantic versioning for the application.
 * Implements thread-safe version operations using a simple locking mechanism.
 */
export class VersionManager {
  private currentVersion: string;
  private lock: Lock;

  constructor(initialVersion: string = '0.1.0') {
    if (!initialVersion || !semver.valid(initialVersion)) {
      console.warn(`Invalid version format: ${initialVersion}, using default`);
      initialVersion = '0.1.0';
    }
    this.currentVersion = initialVersion;
    this.lock = new Lock();
  }

  /**
   * Increments the version number based on the specified type.
   * @param type - The type of version increment (major, minor, or patch)
   * @returns The new version string
   * @throws Error if the version increment fails
   */
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

  /**
   * Validates a version string against semantic versioning rules.
   * @param version - The version string to validate
   * @returns boolean indicating if the version is valid
   */
  validateVersion(version: string): boolean {
    return Boolean(version && semver.valid(version));
  }

  /**
   * Compares two version strings.
   * @param v1 - First version string
   * @param v2 - Second version string
   * @returns -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
   * @throws Error if either version is invalid
   */
  compareVersions(v1: string, v2: string): number {
    if (!this.validateVersion(v1) || !this.validateVersion(v2)) {
      throw new Error('Invalid version format');
    }
    return semver.compare(v1, v2);
  }

  /**
   * Gets the current version.
   * @returns The current version string
   */
  getCurrentVersion(): string {
    return this.currentVersion;
  }
}