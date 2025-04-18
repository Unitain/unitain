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

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (mounted) {
            if (session?.user) {
              // Fetch user data from users table when auth state changes
              try {
                const { data: userData, error: userError } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', session.user.id)
                  .maybeSingle();
                
                if (userError) {
                  console.error('Error fetching user data on auth change:', userError);
                }
                
                // Merge auth user with database user data
                const mergedUser = {
                  ...session.user,
                  ...(userData || {})
                };
                
                setUser(mergedUser);
                localStorage.setItem('userData', JSON.stringify(mergedUser));
              } catch (error) {
                console.error('Error processing auth state change:', error);
                setUser(session.user);
              }
            } else {
              setUser(null);
            }
            
            // switch (event) {
            //   case 'SIGNED_IN':
            //     if (!successMessageShownRef.current) {
            //       toast.success('Successfully signed in!');
            //       successMessageShownRef.current = true;
            //     }
            //     break;
            //   case 'USER_UPDATED':
            //     toast.success('Profile updated');
            //     break;
            //   case 'PASSWORD_RECOVERY':
            //     toast.success('Password reset email sent');
            //     break;
            //   case 'USER_DELETED':
            //     toast.success('Account deleted successfully');
            //     break;
            //   case 'SIGNED_OUT':
            //     successMessageShownRef.current = false;
            //     localStorage.removeItem('sb-auth-token');
            //     localStorage.removeItem('auth-storage');
            //     localStorage.removeItem('userData');
            //     break;
            // }
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