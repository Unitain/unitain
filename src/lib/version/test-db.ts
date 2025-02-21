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
        .select('id')
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

    // Test 1: Select all entries
    const { data: entries, error: selectError } = await supabase
      .from('changelog')
      .select('*')
      .order('date', { ascending: false });

    if (selectError) {
      throw selectError;
    }

    console.log('Current changelog entries:');
    console.table(entries || []);

    // Test 2: Insert a test entry
    const testEntry = {
      version: '1.9.2',
      type: 'added',
      message: 'Test entry from database check',
      date: new Date().toISOString().split('T')[0]
    };

    const { data: newEntry, error: insertError } = await supabase
      .from('changelog')
      .insert([testEntry])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log('\nNew test entry added:');
    console.table([newEntry]);

    // Test 3: Query by version
    const { data: versionEntries, error: versionError } = await supabase
      .from('changelog')
      .select('*')
      .eq('version', '1.9.2');

    if (versionError) {
      throw versionError;
    }

    console.log('\nEntries for version 1.9.2:');
    console.table(versionEntries || []);

    // Test 4: Query entry types
    const { data: typeStats, error: statsError } = await supabase
      .from('changelog')
      .select('type');

    if (statsError) {
      throw statsError;
    }

    const distribution = typeStats?.reduce((acc: Record<string, number>, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {});

    console.log('\nEntry types distribution:');
    console.table(distribution || {});

    console.log('\nDatabase test completed successfully!');
  } catch (error) {
    console.error('Database test failed:', error);
    process.exit(1);
  }
}

// Run the test
testChangelogDatabase();