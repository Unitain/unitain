import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { useAuthStore } from '../lib/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const { setUser } = useAuthStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);
    console.log("loading", loading);
    
    try {
      if (isLogin) {
        // Handle Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }
  
        if (data.user) {
          // Fetch user data from users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          if (userError) {
            console.error('Error fetching user data from users table:', userError);
          }
  
          // Store user data and update state
          const mergedUser = { ...data.user, ...(userData || {}) };
          localStorage.setItem('userData', JSON.stringify(mergedUser));
          setUser(mergedUser);
          
          toast.success('Login successful!');
          onClose();
        }
      } else {
        // Handle Signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Check if user already exists in users table
          const { data: existingUserData, error: existingUserError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          if (existingUserError && existingUserError.code !== 'PGRST116') {
            console.error('Error checking if user exists in users table:', existingUserError);
          }
  
          if (!existingUserData) {
            console.log('User not found in users table, inserting user...');
            // Create new user record
            const newUser = {
              id: data.user.id,
              email: data.user.email,
              created_at: new Date().toISOString(),
              payment_status: 'pending'
            };
            
            const { error: insertError } = await supabase
              .from('users')
              .insert([newUser]);
  
            if (insertError) {
              console.error('Error inserting user into users table:', insertError);
            } else {
              // Set user with the newly created data
              setUser({ ...data.user, ...newUser });
              localStorage.setItem('userData', JSON.stringify(newUser));
            }
          } else {
            // User already exists, use existing data
            setUser({ ...data.user, ...existingUserData });
            localStorage.setItem('userData', JSON.stringify(existingUserData));
          }

          toast.success('Signup successful! Please check your email for confirmation.');
          onClose();
        }
      }
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Signup'} error:`, error);
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Log In' : 'Sign Up'}
        </h2>

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {loading
              ? isLogin
                ? 'Logging in...'
                : 'Signing up...'
              : isLogin
              ? 'Log In'
              : 'Sign Up'}
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary-600 hover:text-primary-700 focus:outline-none"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}