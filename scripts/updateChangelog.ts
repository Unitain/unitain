import { supabase } from '../src/lib/supabase';
import { readFileSync } from 'fs';
import { join } from 'path';

async function updateChangelog() {
  try {
    // Read package.json to get current version
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    );
    const version = packageJson.version;

    if (!version) {
      throw new Error('No version found in package.json');
    }

    // Check if version already exists in changelog
    const { data: existingEntry, error: checkError } = await supabase
      .from('changelog')
      .select('id')
      .eq('version', version)
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    // Only add new entry if version doesn't exist
    if (!existingEntry?.length) {
      const { error: insertError } = await supabase
        .from('changelog')
        .insert({
          version,
          date: new Date().toISOString().split('T')[0],
          type: 'changed',
          message: `Deployed version ${version}`
        });

      if (insertError) {
        throw insertError;
      }

      console.log(`✅ Added changelog entry for version ${version}`);
    } else {
      console.log(`ℹ️ Version ${version} already exists in changelog`);
    }
  } catch (error) {
    console.error('❌ Failed to update changelog:', error);
    process.exit(1);
  }
}

updateChangelog();