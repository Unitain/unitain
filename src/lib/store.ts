import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from './supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isInitialized: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      initialize: async () => {
        if (get().isInitialized) return;

        try {
          // First try to get session from storage
          const storedToken = localStorage.getItem('sb-auth-token');
          if (!storedToken) {
            set({ 
              user: null,
              isInitialized: true,
              isLoading: false
            });
            return;
          }

          // Get current session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.warn('Failed to get session:', error);
            // Clear invalid session data
            localStorage.removeItem('sb-auth-token');
            localStorage.removeItem('auth-storage');
            set({ 
              user: null,
              isInitialized: true,
              isLoading: false
            });
            return;
          }
          
          // If session exists but is expired, try to refresh it
          if (session?.expires_at && new Date(session.expires_at * 1000) < new Date()) {
            try {
              const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
              if (refreshError) {
                console.warn('Session refresh failed:', refreshError);
                // Clear invalid session data
                localStorage.removeItem('sb-auth-token');
                localStorage.removeItem('auth-storage');
                set({ 
                  user: null,
                  isInitialized: true,
                  isLoading: false
                });
                return;
              }
              
              set({ 
                user: refreshData.session?.user ?? null,
                isInitialized: true,
                isLoading: false
              });
              return;
            } catch (error) {
              console.warn('Session refresh error:', error);
              // Clear invalid session data
              localStorage.removeItem('sb-auth-token');
              localStorage.removeItem('auth-storage');
              set({ 
                user: null,
                isInitialized: true,
                isLoading: false
              });
              return;
            }
          }
          
          set({ 
            user: session?.user ?? null,
            isInitialized: true,
            isLoading: false
          });
        } catch (error) {
          console.error('Failed to initialize auth store:', error);
          // Clear any invalid session data
          localStorage.removeItem('sb-auth-token');
          localStorage.removeItem('auth-storage');
          set({ 
            user: null,
            isInitialized: true,
            isLoading: false 
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Initialize auth state
          state.initialize();
        }
      },
    }
  )
);