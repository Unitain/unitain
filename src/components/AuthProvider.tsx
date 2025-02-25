import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, initialize } = useAuthStore();
  const successMessageShownRef = React.useRef(false);
  const mounted = React.useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

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
                // Only show success message if it hasn't been shown yet
                if (!successMessageShownRef.current) {
                  toast.success('Successfully signed in!');
                  successMessageShownRef.current = true;
                }
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
                // Reset success message flag on sign out
                successMessageShownRef.current = false;
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
        if (sessionError) {
          console.warn('Failed to get session:', sessionError);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (session) {
          // If session exists but is expired, try to refresh it
          if (session.expires_at && new Date(session.expires_at * 1000) < new Date()) {
            try {
              const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
              if (refreshError) {
                console.warn('Session refresh failed:', refreshError);
                if (mounted) {
                  setUser(null);
                  setLoading(false);
                }
                // Clear invalid session data
                localStorage.removeItem('sb-auth-token');
                localStorage.removeItem('auth-storage');
                return;
              }
              if (mounted && refreshData.session) {
                setUser(refreshData.session.user);
              }
            } catch (error) {
              console.warn('Session refresh error:', error);
              if (mounted) {
                setUser(null);
                setLoading(false);
              }
              return;
            }
          } else {
            if (mounted) {
              setUser(session.user);
            }
          }
        }

        if (mounted) {
          setLoading(false);
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
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