import { supabase } from './supabase';
import toast from 'react-hot-toast';

export async function handleSignUp(email: string, password: string) {
  try {
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          redirect_on_confirmation: redirectTo
        }
      }
    });

    if (error) throw error;
if (data?.user) {
  console.log('data.user.id', data.user.id);
      toast.success('Please check your email to confirm your account.');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Sign up error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to sign up');
    return false;
  }
}

export function storeRedirectUrl(url: string) {
  try {
    localStorage.setItem('nextUrl', url);
  } catch (error) {
    console.warn('Failed to store redirect URL:', error);
  }
}

export function getRedirectUrl(userId: string): string {
  try {
    return localStorage.getItem('nextUrl') || `/dashboard/${userId}/submission`;
  } catch (error) {
    console.warn('Failed to get redirect URL:', error);
    return `/dashboard/${userId}/submission`;
  }
}