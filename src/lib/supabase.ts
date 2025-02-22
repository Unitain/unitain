import { createClient, SupabaseClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase configuration is missing or invalid');
    return false;
  }
  return true;
};

// Create the Supabase client with enhanced error handling
export const supabase: SupabaseClient = (() => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }

  try {
    const client = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: 'sb-auth-token',
        flowType: 'pkce'
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'x-client-info': '@supabase/auth-ui-react'
        }
      }
    });

    // Log configuration for debugging
    console.debug('Supabase Auth Config:', {
      flowType: client.auth.flowType,
      detectSessionInUrl: client.auth.detectSessionInUrl,
      persistSession: client.auth.persistSession
    });

    // Initialize session recovery with retry logic
    const initializeSession = async (retryCount = 0) => {
      try {
        const { data: { session }, error } = await client.auth.getSession();
        
        if (error) {
          if (error.message === 'Failed to fetch' && retryCount < 3) {
            console.warn(`Retrying session initialization (attempt ${retryCount + 1})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return initializeSession(retryCount + 1);
          }
          throw error;
        }

        // If we have a session but it's expired, try to refresh it
        if (session && new Date(session.expires_at!) < new Date()) {
          const { data: refreshData, error: refreshError } = await client.auth.refreshSession();
          if (refreshError) throw refreshError;
          return refreshData.session;
        }

        return session;
      } catch (error) {
        console.error('Session initialization error:', error);
        if (error.message !== 'session_not_found') {
          client.auth.signOut().catch(console.error);
          localStorage.removeItem('sb-auth-token');
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('pendingEligibilityCheck');
        }
        return null;
      }
    };

    // Initialize session
    initializeSession();

    // Set up auth state change listener
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        localStorage.removeItem('sb-auth-token');
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('pendingEligibilityCheck');
      }
    });

    return client;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw error;
  }
})();

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);

  if (error?.message?.includes('Failed to fetch')) {
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
    return 'The service is temporarily unavailable. Please try again in a few minutes.';
  }

  if (error?.code === 'PGRST116') {
    return 'Unable to process your request. Please try again later.';
  }

  return error?.message || 'An unexpected error occurred. Please try again.';
};