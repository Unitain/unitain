import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { setUser } = useAuthStore();
  const navigate = useNavigate()

//   function setUserCookie(userData: any) {
//     if (!userData) {
//         console.error("🚨 No userData provided, cannot set cookie.");
//         return;
//     }
//     console.log("🚀 Setting Cookie: ", userData);

//     // const value = encodeURIComponent(JSON.stringify(userData)); 
//     const value = JSON.stringify(userData);

//     let cookie = `userData=${value}; Path=/; Domain=.unitain.net; Secure; SameSite=None; Expires=Fri, 31 Dec 9999 23:59:59 GMT;`;

//     document.cookie = cookie;
//     console.log("✅ Cookie successfully set:", document.cookie);
// }


  function setUserCookie(userData: any) {
    if (!userData) {
        console.error("🚨 No userData provided, cannot set cookie.");
        return;
    }
    console.log("🚀 Setting Cookie: ", userData);
    const value = JSON.stringify(userData);

    let cookieBase = `userData=${value}; Path=/; Secure; SameSite=None; Expires=Fri, 31 Dec 9999 23:59:59 GMT;`;

    document.cookie = cookieBase;
    console.log("✅ Cookie set for localhost:", document.cookie);

    if (window.location.hostname !== "localhost") {
        document.cookie = cookieBase + " Domain=.unitain.net;";
        console.log("✅ Cookie set for unitain.net:", document.cookie);
    }
  }

  
  const handleAuth = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);

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

          setUserCookie(mergedUser);
          console.log("🚀 🚀 🚀🚀 🚀 🚀🚀 🚀 🚀 cookie set", mergedUser);

          setUser(mergedUser);

          toast.success('Login successful!');
          onClose();
          navigate("/", { replace: true });
          onAuthSuccess?.();

          if(onAuthSuccess && userData?.is_eligible === false){
            const { error: eligibleError } = await supabase
            .from('users')
            .update({is_eligible: true })
            .eq('id', userData?.id)
    
            if(eligibleError){
              toast.error('Failed to save eligibility check:', eligibleError);
            }
          }
        }
      } 
      else {
        if (!acceptedTerms) {
          toast.error('Please accept the Terms of Use before signing up.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        console.log("🚀🚀data", data);
        
        if (error) {throw error;}

          const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: data?.user.id,
                  email: data?.user.email,
                  created_at: new Date().toISOString(),
                  payment_status: 'pending',
                  is_eligible: false,
                },
              ]);
  
            if (insertError) {
              console.error('Error inserting user into users table:', insertError);
              throw insertError;
            }
            const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();
    
            localStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);
            setUserCookie(userData);
            console.log("🚀 🚀 🚀🚀 🚀 🚀🚀 🚀 🚀 cookie set", userData);

            if (fetchError) {
              console.error('Error fetching user data: ', fetchError);
              return;
            }

            toast.success('Signup successful! Please check your email for confirmation.');
            onClose(); 
            navigate("/", { replace: true });
            onAuthSuccess?.();

            console.log("🚀 ~ handleAuth ~ insertError:", insertError)

            if(onAuthSuccess && userData?.is_eligible === false){
              const { error:eligibleError } = await supabase
              .from('users')
              .update({is_eligible: true })
              .eq('id', userData?.id)
      
              if(eligibleError){
                toast.error('Failed to save eligibility check:', eligibleError);
              }
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
        onClick={() => {
          onClose();
          navigate("/", { replace: true });
        }}        
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

          {!isLogin && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700 font-semibold">
                I accept the{' '}
                <a href="/terms" className="text-primary-700 " target="_blank" rel="noreferrer">
                  Terms of Use
                </a>
                <p className='text-gray-600 font-normal'>By continuing, you agree to our terms and conditions.</p>
              </label>
            </div>
          )}

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
            onClick={() => setIsLogin(!isLogin) }
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