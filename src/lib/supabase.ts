import { createClient } from '@supabase/supabase-js';

// Get environment variables with validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Create the Supabase client with enhanced error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'sb-auth-token'
  },
  global: {
    headers: {
      'x-application-name': 'unitain',
      'x-client-info': 'unitain',
      'Origin': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
    }
  },
  db: {
    schema: 'public'
  }
});

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Helper to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);

  if (error?.message?.includes('Failed to fetch') || error?.message?.includes('CORS')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error?.message?.includes('JWT expired')) {
    return 'Your session has expired. Please sign in again.';
  }

  if (error?.code === '42P01') {
    return 'System is being updated. Please try again in a few minutes.';
  }

  if (error?.code === '23505') {
    return 'A record with this information already exists.';
  }

  if (error?.code === '23503') {
    return 'Invalid reference. Please try again.';
  }

  if (error?.status === 404) {
    return 'The requested resource was not found.';
  }

  return error?.message || 'An unexpected error occurred. Please try again.';
};