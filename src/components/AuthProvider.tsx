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

        // Listen for changes on auth state (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (mounted) {
            setUser(session?.user ?? null);
            
            // Show appropriate notifications
            switch (event) {
              case 'SIGNED_IN':
                toast.success('Successfully signed in!');
                break;
              case 'SIGNED_OUT':
                toast.success('Successfully signed out');
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
            }
          }
        });

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