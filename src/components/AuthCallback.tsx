import React, { useEffect } from 'react';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';
import toast from 'react-hot-toast';

export function AuthCallback() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        console.log('AuthCallback: Starting authentication process');
        console.log('AuthCallback: Code present:', !!code);

        if (!code) {
          throw new Error('No code found in URL');
        }

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('AuthCallback: Session exchange error:', error);
          throw error;
        }

        if (data.session) {
          // Store the session
          localStorage.setItem('sb-auth-token', data.session.access_token);
          
          // Set the user in the store
          setUser(data.session.user);
          
          // Handle redirect
          const redirectUrl = localStorage.getItem('nextUrl') || `https://app.unitain.net`;
          localStorage.removeItem('nextUrl');
          
          console.log('AuthCallback: Redirecting to:', redirectUrl);
          
          // Show success message and redirect
          toast.success('Successfully signed in!');
          window.location.href = redirectUrl;
        } else {
          console.error('AuthCallback: No session in response');
          window.location.href = '/';
          toast.error('Authentication failed. Please try again.');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        window.location.href = '/';
        toast.error(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
      }
    };
    
    handleCallback();
  }, [setUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}