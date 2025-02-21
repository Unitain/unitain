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