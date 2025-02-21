import { VersionManager } from './VersionManager';
import { ChangelogManager } from './ChangelogManager';

async function testVersionTracking() {
  try {
    // Initialize managers
    const versionManager = new VersionManager('1.8.3');
    const changelogManager = new ChangelogManager();
    await changelogManager.initialize();

    console.log('Initial version:', versionManager.getCurrentVersion());

    // Test feature addition (should increment minor version)
    await versionManager.trackChange('added', 'Added multi-language support');
    console.log('Version after feature:', versionManager.getCurrentVersion());

    // Test bug fix (should increment patch version)
    await versionManager.trackChange('fixed', 'Fixed timezone detection');
    console.log('Version after fix:', versionManager.getCurrentVersion());

    // Generate and display changelog
    const changelog = await changelogManager.generateChangelog(versionManager.getCurrentVersion());
    console.log('\nChangelog for current version:');
    console.log(changelog);

    // Export full changelog
    const fullChangelog = await changelogManager.exportToMarkdown();
    console.log('\nFull Changelog:');
    console.log(fullChangelog);

    // Get version history
    const history = await versionManager.getVersionHistory();
    console.log('\nVersion History:');
    console.log(history);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testVersionTracking();