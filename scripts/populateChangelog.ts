import { supabase } from '../src/lib/supabase';

const entries = [
  {
    "version": "1.0.0",
    "date": "2024-01-01",
    "type": "added",
    "message": "Initial release with core functionality."
  },
  {
    "version": "1.1.0",
    "date": "2024-02-15",
    "type": "added",
    "message": "Added user authentication and signup via email."
  },
  {
    "version": "1.2.0",
    "date": "2024-03-10",
    "type": "added",
    "message": "Implemented multi-language support (English, German, French)."
  },
  {
    "version": "1.3.0",
    "date": "2024-04-05",
    "type": "added",
    "message": "Introduced payment integration via Stripe."
  },
  {
    "version": "1.4.0",
    "date": "2024-05-20",
    "type": "fixed",
    "message": "Fixed authentication issue causing session timeouts."
  },
  {
    "version": "1.5.0",
    "date": "2024-06-15",
    "type": "added",
    "message": "Redesigned user dashboard with better navigation."
  },
  {
    "version": "1.6.0",
    "date": "2024-07-10",
    "type": "added",
    "message": "Implemented PayPal payment option."
  },
  {
    "version": "1.6.5",
    "date": "2024-08-01",
    "type": "fixed",
    "message": "Fixed currency conversion issue in checkout."
  },
  {
    "version": "1.7.0",
    "date": "2024-09-12",
    "type": "added",
    "message": "Introduced dark mode and accessibility improvements."
  },
  {
    "version": "1.7.5",
    "date": "2024-10-05",
    "type": "fixed",
    "message": "Fixed mobile responsiveness for small screens."
  },
  {
    "version": "1.8.0",
    "date": "2024-11-20",
    "type": "added",
    "message": "Introduced webhook support for real-time updates."
  },
  {
    "version": "1.8.3",
    "date": "2024-12-15",
    "type": "fixed",
    "message": "Fixed timezone handling for international users."
  }
];

async function populateChangelog() {
  console.log('🔄 Starting changelog population...');

  try {
    // Insert entries in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('changelog')
        .insert(batch)
        .select();

      if (error) {
        if (error.code === '23505') { // Unique violation
          console.log('⚠️ Some entries already exist, continuing...');
        } else {
          throw error;
        }
      }

      console.log(`✅ Inserted entries ${i + 1} to ${Math.min(i + batchSize, entries.length)}`);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('✅ Successfully populated changelog table');
  } catch (error) {
    console.error('❌ Error populating changelog:', error);
    process.exit(1);
  }
}

populateChangelog();