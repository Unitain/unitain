import { describe, it, expect, beforeEach } from 'vitest';
import { VersionManager } from '../VersionManager';

describe('VersionManager', () => {
  let versionManager: VersionManager;

  beforeEach(() => {
    versionManager = new VersionManager('1.0.0');
  });

  it('should initialize with a valid version', () => {
    expect(versionManager.getCurrentVersion()).toBe('1.0.0');
  });

  it('should throw error for invalid initial version', () => {
    expect(() => new VersionManager('invalid')).toThrow();
  });

  it('should increment major version', async () => {
    const newVersion = await versionManager.incrementVersion('major');
    expect(newVersion).toBe('2.0.0');
  });

  it('should increment minor version', async () => {
    const newVersion = await versionManager.incrementVersion('minor');
    expect(newVersion).toBe('1.1.0');
  });

  it('should increment patch version', async () => {
    const newVersion = await versionManager.incrementVersion('patch');
    expect(newVersion).toBe('1.0.1');
  });

  it('should validate version strings', () => {
    expect(versionManager.validateVersion('1.0.0')).toBe(true);
    expect(versionManager.validateVersion('invalid')).toBe(false);
  });

  it('should compare versions correctly', () => {
    expect(versionManager.compareVersions('1.0.0', '2.0.0')).toBe(-1);
    expect(versionManager.compareVersions('2.0.0', '1.0.0')).toBe(1);
    expect(versionManager.compareVersions('1.0.0', '1.0.0')).toBe(0);
  });
});