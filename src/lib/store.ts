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

// Create store with optimized persistence
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
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          // If session exists but is expired, try to refresh it
          if (session?.expires_at && new Date(session.expires_at * 1000) < new Date()) {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) throw refreshError;
            
            set({ 
              user: refreshData.session?.user ?? null,
              isInitialized: true,
              isLoading: false
            });
            return;
          }
          
          set({ 
            user: session?.user ?? null,
            isInitialized: true,
            isLoading: false
          });
        } catch (error) {
          console.error('Failed to initialize auth store:', error);
          // Clear any invalid session data
          set({ 
            user: null,
            isInitialized: true,
            isLoading: false 
          });
          localStorage.removeItem('sb-auth-token');
          localStorage.removeItem('auth-storage');
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