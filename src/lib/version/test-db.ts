import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), '.env') });

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required environment variables VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function waitForTable(tableName: string, maxAttempts = 5): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('count(*)')
        .limit(1);

      if (!error) {
        console.log(`Table ${tableName} is ready`);
        return;
      }

      if (attempt === maxAttempts) {
        throw error;
      }

      console.log(`Waiting for table ${tableName} (attempt ${attempt}/${maxAttempts})...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function testChangelogDatabase() {
  try {
    console.log('Testing changelog database integration...\n');

    // Wait for the changelog table to be ready
    await waitForTable('changelog');

    // 1. Check existing entries
    const { data: entries, error: selectError } = await supabase
      .from('changelog')
      .select('*')
      .order('date', { ascending: false });

    if (selectError) {
      throw selectError;
    }

    console.log('Current changelog entries:');
    console.table(entries || []);

    // 2. Add a new test entry
    const { data: newEntry, error: insertError } = await supabase
      .from('changelog')
      .insert({
        version: '1.8.4',
        type: 'added',
        message: 'Test entry from database check',
        date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log('\nNew test entry added:');
    console.table([newEntry]);

    // 3. Check entries for specific version
    const { data: versionEntries, error: versionError } = await supabase
      .from('changelog')
      .select('*')
      .eq('version', '1.8.4');

    if (versionError) {
      throw versionError;
    }

    console.log('\nEntries for version 1.8.4:');
    console.table(versionEntries || []);

    // 4. Check entry types distribution
    const { data: typeStats, error: statsError } = await supabase
      .from('changelog')
      .select('type, count(*)')
      .group('type');

    if (statsError) {
      throw statsError;
    }

    console.log('\nEntry types distribution:');
    console.table(typeStats || []);

    console.log('\nDatabase test completed successfully!');
  } catch (error) {
    console.error('Database test failed:', error);
    process.exit(1);
  }
}

// Run the test
testChangelogDatabase();