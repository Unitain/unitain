// import React, { useState, useEffect } from 'react';
// import { Auth } from '@supabase/auth-ui-react';
// import { ThemeSupa } from '@supabase/auth-ui-shared';
// import { supabase } from '../lib/supabase';
// import { X } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { useAuthStore } from '../lib/store';

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function AuthModal({ isOpen, onClose }: AuthModalProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const { user } = useAuthStore();

//   // Auto-close modal when user becomes authenticated
//   useEffect(() => {
//     if (user && isOpen) {
//       onClose();
//     }
//   }, [user, isOpen, onClose]);

//   if (!isOpen) return null;

//   const handleAuthSuccess = () => {
//     toast.success('Successfully signed in!');
//     setIsLoading(false);
//     onClose();

//     // Get stored redirect URL or generate default dashboard URL
//     const redirectUrl = localStorage.getItem('nextUrl') || `/dashboard/${user?.id}/submission`;
//     localStorage.removeItem('nextUrl');
//     window.location.href = redirectUrl;
//   };

//   const handleAuthError = (error: Error) => {
//     toast.error(error.message);
//     setIsLoading(false);
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

//         <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
//           <div className="absolute right-0 top-0 pr-4 pt-4">
//             <button
//               type="button"
//               className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//               onClick={onClose}
//             >
//               <span className="sr-only">Close</span>
//               <X className="h-6 w-6" />
//             </button>
//           </div>

//           <div className="sm:flex sm:items-start">
//             <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
//               <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
//                 Sign In or Create Account
//               </h3>
//               <Auth
//                 supabaseClient={supabase}
//                 appearance={{
//                   theme: ThemeSupa,
//                   variables: {
//                     default: {
//                       colors: {
//                         brand: '#2563eb',
//                         brandAccent: '#1d4ed8',
//                       },
//                     },
//                   },
//                 }}
//                 providers={[]}
//                 redirectTo={`${window.location.origin}/auth/callback`}
//                 onlyThirdPartyProviders={false}
//                 onSuccess={handleAuthSuccess}
//                 onError={handleAuthError}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


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
  const { setUser } = useAuthStore.getState();

  // function setUserCookie(userData: any) {
  //   if (!userData) {
  //       console.error("🚨 No userData provided, cannot set cookie.");
  //       return;
  //   }
  //   console.log("🚀 Setting Cookie: ", userData);

  //   const value = JSON.stringify(userData);  // No encodeURIComponent
  //   const host = window.location.hostname;
  //   let cookie = `userData=${value}; path=/; samesite=Lax`;

  //   if (host.endsWith('.unitain.net')) {
  //     cookie += `; domain=unitain.net; secure`;  
  //   }
  //   document.cookie = cookie;
  //   console.log("✅ Cookie set: ", cookie);
  // }
  function setUserCookie(userData: any) {
    if (!userData) {
        console.error("🚨 No userData provided, cannot set cookie.");
        return;
    }
    console.log("🚀 Setting Cookie: ", userData);
    const value = encodeURIComponent(JSON.stringify(userData)); // Encode for safety
    const host = window.location.hostname;
    let cookie = `userData=${value}; Path=/; SameSite=None; Secure;`;

    if (host.endsWith(".unitain.net")) {
        cookie += " Domain=.unitain.net;";
    }

    document.cookie = cookie;
    console.log("✅ Cookie successfully set:", document.cookie);
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

            localStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);

            setUserCookie(userData);
            console.log("🚀 🚀 🚀🚀 🚀 🚀🚀 🚀 🚀cookie set");
            
          if (userError) {
            console.error('Error fetching user data from users table:', userError);
            throw userError;
          }
  
          if (userData) {
            console.log('User data fetched from users table:', userData);
          } else {
            console.error('User data not found in users table');
          }
        }  
        toast.success('Login successful!');
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
          const { data: existingUserData, error: existingUserError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

            localStorage.setItem('userData', JSON.stringify(existingUserData));
            setUser(existingUserData);

            setUserCookie(existingUserData);
            console.log("🚀 🚀 🚀🚀 🚀 🚀🚀 🚀 🚀 cookie set");
            

          if (existingUserError) {
            console.error('Error checking if user exists in users table:', existingUserError);
            throw existingUserError;
          }
  
          if (!existingUserData) {
            console.log('User not found in users table, inserting user...');
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: data.user.id,
                  email: data.user.email,
                  created_at: new Date().toISOString(),
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

            if (fetchError) {
              console.error('Error fetching user data: ', fetchError);
              return;
            }

            toast.success('Signup successful! Please check your email for confirmation.');
          } else {
            console.log('User already exists in users table:', existingUserData);
          }
        }
      }

      onClose(); // Close the modal after successful login/signup
    } catch (error) {
      toast.error(`${isLogin ? 'Login' : 'Signup'} failed: ${error.message}`);
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none"
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