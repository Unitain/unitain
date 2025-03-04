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
          // Get session from storage first
          const storedToken = localStorage.getItem('sb-auth-token');
          const storedSession = storedToken ? await supabase.auth.getSession() : null;

          // If stored session exists and is valid, use it
          if (storedSession?.data?.session?.user) {
            // Try to get user data from localStorage first
            let userData = null;
            try {
              const storedUserData = localStorage.getItem('userData');
              if (storedUserData) {
                userData = JSON.parse(storedUserData);
              }
            } catch (error) {
              console.error('Failed to parse stored user data:', error);
            }

            // Merge auth user with stored user data
            const mergedUser = {
              ...storedSession.data.session.user,
              ...(userData || {})
            };

            set({ 
              user: mergedUser,
              isInitialized: true,
              isLoading: false
            });
            return;
          }

          // Otherwise try to get a fresh session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            // Clean up invalid session data
            localStorage.removeItem('sb-auth-token');
            localStorage.removeItem('auth-storage');
            localStorage.removeItem('userData');
            set({ 
              user: null,
              isInitialized: true,
              isLoading: false
            });
            return;
          }

          if (!session) {
            set({ 
              user: null,
              isInitialized: true,
              isLoading: false
            });
            return;
          }

          // Store valid session
          localStorage.setItem('sb-auth-token', session.access_token);
          
          // Only fetch user details if we have a valid user ID
          let userDetails = null;
          if (session.user?.id) {
            const { data: fetchedUserDetails, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (userError) {
              console.error('Error fetching user details:', userError.message);
            } else {
              userDetails = fetchedUserDetails;
            }
          }

          // Merge auth user with database user details
          const mergedUser = { 
            ...session.user, 
            ...(userDetails || {}) 
          };

          // Store the merged user data
          localStorage.setItem('userData', JSON.stringify(mergedUser));
          
          set({ 
            user: mergedUser, 
            isInitialized: true,
            isLoading: false
          });

          // Set up session refresh
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (event === 'TOKEN_REFRESHED' && session) {
                localStorage.setItem('sb-auth-token', session.access_token);
                set({ user: session.user });
              }
            }
          );

          return () => {
            subscription.unsubscribe();
          };
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Clean up on error
          localStorage.removeItem('sb-auth-token');
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('userData');
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