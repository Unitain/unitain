import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client for the script
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateChangelog() {
  try {
    console.log('🔄 Starting changelog update...');
    console.log('📡 Connected to Supabase:', supabaseUrl);

    // Read package.json to get current version
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    );
    const version = packageJson.version;

    if (!version) {
      throw new Error('No version found in package.json');
    }

    console.log(`📦 Current version: ${version}`);

    // Check if version already exists in changelog
    const { data: existingEntry, error: checkError } = await supabase
      .from('changelog')
      .select('id')
      .eq('version', version)
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking existing entry:', checkError);
      throw checkError;
    }

    console.log(`🔍 Checking for existing entry: ${existingEntry?.length ? 'Found' : 'Not found'}`);

    // Only add new entry if version doesn't exist
    if (!existingEntry?.length) {
      const entry = {
        version,
        date: new Date().toISOString().split('T')[0],
        type: 'fixed' as const,
        message: 'Fixed double sign-out notification issue'
      };

      console.log('📝 Creating new entry:', entry);

      const { error: insertError } = await supabase
        .from('changelog')
        .insert([entry]);

      if (insertError) {
        console.error('❌ Error inserting entry:', insertError);
        throw insertError;
      }

      console.log(`✅ Successfully added changelog entry for version ${version}`);
    } else {
      console.log(`ℹ️ Version ${version} already exists in changelog`);
    }
  } catch (error) {
    console.error('❌ Failed to update changelog:', error);
    process.exit(1);
  }
}

updateChangelog();