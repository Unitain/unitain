import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VersionManager } from '../VersionManager';
import { ChangelogManager } from '../ChangelogManager';
import { supabase } from '../../supabase';

describe('Version Tracking System', () => {
  let versionManager: VersionManager;
  let changelogManager: ChangelogManager;

  beforeEach(async () => {
    // Initialize with a known version
    versionManager = new VersionManager('1.8.3');
    changelogManager = new ChangelogManager();
    await changelogManager.initialize();
  });

  afterEach(async () => {
    await changelogManager.cleanup();
  });

  describe('Version Management', () => {
    it('should automatically increment version for new features', async () => {
      await versionManager.trackChange('added', 'Added new login screen');
      expect(versionManager.getCurrentVersion()).toBe('1.9.0');
    });

    it('should automatically increment version for bug fixes', async () => {
      await versionManager.trackChange('fixed', 'Fixed mobile layout issues');
      expect(versionManager.getCurrentVersion()).toBe('1.8.4');
    });

    it('should handle multiple changes correctly', async () => {
      await versionManager.trackChange('added', 'Added new feature');
      await versionManager.trackChange('fixed', 'Fixed a bug');
      expect(versionManager.getCurrentVersion()).toBe('1.9.1');
    });
  });

  describe('Changelog Management', () => {
    it('should record changes in the database', async () => {
      const message = 'Added new authentication system';
      await versionManager.trackChange('added', message);
      
      const entries = await changelogManager.getEntriesForVersion('1.9.0');
      expect(entries).toHaveLength(1);
      expect(entries[0].message).toBe(message);
    });

    it('should generate correct markdown format', async () => {
      await versionManager.trackChange('added', 'Feature A');
      await versionManager.trackChange('fixed', 'Bug fix B');
      
      const markdown = await changelogManager.generateChangelog('1.9.1');
      expect(markdown).toContain('### Added');
      expect(markdown).toContain('### Fixed');
      expect(markdown).toContain('- Feature A');
      expect(markdown).toContain('- Bug fix B');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      vi.spyOn(supabase, 'from').mockImplementationOnce(() => {
        throw new Error('Database connection failed');
      });

      await expect(
        versionManager.trackChange('added', 'Test feature')
      ).rejects.toThrow();
    });

    it('should validate version format', () => {
      expect(() => new VersionManager('invalid')).toThrow();
      expect(() => new VersionManager('1.0.0')).not.toThrow();
    });
  });

  describe('Cache Management', () => {
    it('should use cache for repeated queries', async () => {
      const spy = vi.spyOn(supabase, 'from');
      
      await versionManager.trackChange('added', 'Test feature');
      
      // First query should hit database
      await changelogManager.getEntriesForVersion('1.9.0');
      expect(spy).toHaveBeenCalledTimes(1);
      
      // Second query should use cache
      await changelogManager.getEntriesForVersion('1.9.0');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});