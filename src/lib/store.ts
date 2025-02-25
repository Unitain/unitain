import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from './supabase';
import toast from 'react-hot-toast';

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
          // First check if we have a valid session in Supabase
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.warn('Failed to get session:', sessionError);
            // Clear any invalid session data
            localStorage.removeItem('sb-auth-token');
            localStorage.removeItem('auth-storage');
            set({ 
              user: null,
              isInitialized: true,
              isLoading: false
            });
            return;
          }

          // If no session, clear state and return
          if (!session) {
            set({ 
              user: null,
              isInitialized: true,
              isLoading: false
            });
            return;
          }

          // If session exists but is expired, try to refresh it
          if (session.expires_at && new Date(session.expires_at * 1000) < new Date()) {
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

              if (!refreshData.session) {
                set({ 
                  user: null,
                  isInitialized: true,
                  isLoading: false
                });
                return;
              }

              // Store refreshed session
              localStorage.setItem('sb-auth-token', refreshData.session.access_token);
              set({ 
                user: refreshData.session.user,
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

          // Valid session exists
          localStorage.setItem('sb-auth-token', session.access_token);
          set({ 
            user: session.user,
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
          state.initialize();
        }
      },
    }
  )
);