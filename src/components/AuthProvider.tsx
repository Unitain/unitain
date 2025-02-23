import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, initialize } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        if (mounted) {
          await initialize();
        }

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (mounted) {
            setUser(session?.user ?? null);
            
            // Show appropriate notifications
            switch (event) {
              case 'SIGNED_IN':
                toast.success('Successfully signed in!');
                break;
              case 'USER_UPDATED':
                toast.success('Profile updated');
                break;
              case 'PASSWORD_RECOVERY':
                toast.success('Password reset email sent');
                break;
              case 'USER_DELETED':
                toast.success('Account deleted successfully');
                break;
              case 'SIGNED_OUT':
                // Clear all auth-related storage
                localStorage.removeItem('sb-auth-token');
                localStorage.removeItem('auth-storage');
                localStorage.removeItem('pendingEligibilityCheck');
                break;
            }
          }
        });

        // Try to recover existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
          // If session exists but is expired, try to refresh it
          if (new Date(session.expires_at!) < new Date()) {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) throw refreshError;
            if (refreshData.session) {
              setUser(refreshData.session.user);
            }
          } else {
            setUser(session.user);
          }
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
          if (error instanceof Error) {
            toast.error(error.message);
          }
        }
      }
    };

    initializeAuth();
  }, [setUser, setLoading, initialize]);

  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}