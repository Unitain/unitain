import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseAnonKey ? 'present' : 'missing'
  });
  
  if (import.meta.env.DEV) {
    console.info(`
      Please ensure your .env file exists and contains:
      VITE_SUPABASE_URL=your-project-url
      VITE_SUPABASE_ANON_KEY=your-anon-key
    `);
  }
  
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'sb-auth-token',
    flowType: 'pkce',
    // debug: import.meta.env.DEV
    debug: false
  },
  global: {
    headers: {
      'x-application-name': 'unitain',
      'x-client-info': 'unitain',
      'Origin': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
    }
  }
});

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

export const handleSupabaseError = (error: any): string => {
  if (error?.name === 'AuthSessionMissingError') {
    return 'Please sign in to continue.';
  }

  if (error?.message?.includes('Failed to fetch') || error?.message?.includes('CORS')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error?.message?.includes('JWT expired')) {
    return 'Your session has expired. Please sign in again.';
  }

  return error?.message || 'An unexpected error occurred. Please try again.';
};



// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   console.error('❌ Missing Supabase environment variables');
// }
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);