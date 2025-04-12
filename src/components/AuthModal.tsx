import { useState,useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'signup'; 
  onSuccess?: (userId: string) => Promise<void>;
}

export function AuthModal({ isOpen, onClose, defaultView = 'login', onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); 
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string>('1.8.9'); 
  const [ipAddress, setIpAddress] = useState('');
  const [activeToS, setActiveTos] = useState(null)
  const { setUser } = useAuthStore();
  const navigate = useNavigate()
  const [isResetPassword, setIsResetPassword] = useState(false); 
  
  const fetchActiveTermsOfService = async () => {
    const { data, error } = await supabase
      .from('terms_of_service')
      .select('*')
      .eq('is_active', true)
      .single();

    if(error){
      console.error("error", error);
      return
    }
    setActiveTos(data)
  };

  useEffect(()=>{
    fetchActiveTermsOfService()
  }, [])

  useEffect(() => {
    if (!isOpen) return;
    setEmail("");
    setPassword("");
    setAcceptedTerms(false);
    setIsLogin(defaultView === 'login');
  }, [isOpen, defaultView]);

  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch('https://api64.ipify.org?format=json');
        const data = await res.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
      }
    }
    fetchIP();
  }, []);

  function setUserCookie(userData: any) {
    if (!userData) {
        console.error("🚨 No userData provided, cannot set cookie.");
        return;
    }
    const trimmedUserData = {
      id: userData.id,
      email: userData.email,
      created_at: userData.created_at,
      payment_status: userData.payment_status,
      is_eligible: userData.is_eligible,
      ToS_checked: userData.ToS_checked
  };

    console.log("🚀 Setting Cookie: ", trimmedUserData);
    const value = JSON.stringify(trimmedUserData);

    let cookieBase = `userData=${value}; Path=/; Secure; SameSite=None; Expires=Fri, 31 Dec 9999 23:59:59 GMT;`;

    if (window.location.hostname === "localhost") {
        document.cookie = cookieBase;
    } else {
        document.cookie = cookieBase + " Domain=.unitain.net;";
        console.log("✅ Cookie set for unitain.net:", document.cookie);
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isResetPassword) {
      await handlePasswordReset();
      return;
    }
    
    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } catch (error) {
      console.error(`${isLogin ? "Login" : "Signup"} error:`, error);
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

        if (data?.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();
          if (userError) {
            console.error('Error fetching user data from users table:', userError);
          }

          const mergedUser = { ...data.user, ...(userData || {}) };
          localStorage.setItem('userData', JSON.stringify(mergedUser));
          setUserCookie(mergedUser);
          setUser(mergedUser);

          toast.success('Login successful!');
          onClose();
          if(userData?.is_eligible === false){
            navigate("/", { replace: true });
          }else{
            window.location.href = "https://app.unitain.net"
            // window.location.href = "http://localhost:5174"
          }
  };
  }
  
  // const handleSignup = async () => {
  //   if (!acceptedTerms) {
  //     throw new Error("Please accept the Terms of Use before signing up.");
  //   }
  
  //   if (!activeToS) {
  //     throw new Error("Terms of Service information not loaded. Please try again.");
  //   }
  
  //   const { data, error } = await supabase.auth.signUp({ 
  //     email, 
  //     password,
  //     options: {
  //       // Updated to point to your auth callback route
  //       // emailRedirectTo: 'https://unitain.net/auth/callback',
  //       emailRedirectTo: 'http://localhost:5176/auth/callback',
  //       data: {
  //         tos_version_id: activeToS.id,
  //         ip_address: ipAddress,
  //         device_info: navigator.userAgent,
  //       }
  //     },
  //   });
    
  //   if (error) throw error;
    
  //   // Store pending signup info with additional metadata
  //   const pendingSignup = {
  //     email,
  //     tosData: {
  //       tos_version_id: activeToS.id,
  //       ip_address: ipAddress,
  //       device_info: navigator.userAgent,
  //     },
  //     timestamp: new Date().toISOString()
  //   };
    
  //   localStorage.setItem('pendingSignup', JSON.stringify(pendingSignup));
    
  //   toast.success(
  //     <div>
  //       <p>Please check your email to confirm your account.</p>
  //       <p>Your account will be fully created after confirmation.</p>
  //     </div>,
  //     { duration: 6000 }
  //   );
    
  //   onClose();
  //   navigate("/", { replace: true });
  // };
  
  const handleSignup = async () => {
    if (!acceptedTerms) {
      throw new Error("Please accept the Terms of Use");
    }
  
    if (!activeToS) {
      throw new Error("Terms of Service not loaded");
    }
  
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          tos_version_id: activeToS.id,
          ip_address: ipAddress,
          device_info: navigator.userAgent,
        }
      },
    });
    
    if (error) throw error;
    
    // Store pending signup info
    localStorage.setItem('pendingSignup', JSON.stringify({
      email,
      tosData: {
        tos_version_id: activeToS.id,
        ip_address: ipAddress,
        device_info: navigator.userAgent,
      }
    }));
    
    toast.success("Check your email for confirmation");
    onClose();
    navigate("/");
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error('Please enter your email to reset your password');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        throw error;
      }

      toast.success('Check your email for password reset instructions');
      setIsResetPassword(false); // After request, switch back to login view
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
        onClick={() => {
          onClose();
          navigate("/", { replace: true });
        }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold text-center">
          {isResetPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h2>
        <p className="text-gray-600 p-4 mb-4 text-center">
          {isResetPassword
            ? 'Enter your email to receive password reset instructions'
            : isLogin
            ? 'Log in to access your personal dashboard'
            : 'Sign up to get started with our services'}
        </p>

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
              autoComplete="email"
            />
          </div>

        {!isResetPassword && (
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
              autoComplete={isLogin ? "current-password" : "new-password"}
              minLength={6}
            />
            {isLogin && (
              <button
                type="button"
                onClick={() => setIsResetPassword(true)}
                className="text-sm text-primary-600 hover:text-primary-700 focus:outline-none mt-2"
              >
                Forgot your password?
              </button>
            )}
          </div>
        )}

          {!isLogin && !isResetPassword && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I accept the{" "}
                <a
                  href="/terms"
                  className="text-primary-700 font-semibold hover:underline"
                  target="_blank"
                  rel="noreferrer"
                  >
                  Terms of Use
                </a>
                <p className="text-gray-600 font-normal">
                  By continuing, you agree to our terms and conditions.
                </p>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block animate-spin">↻</span>
            ) : isResetPassword ? (
              'Reset Password'
            ) : isLogin ? (
              'Log In'
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setIsResetPassword(false);
            }}
            className="text-sm text-primary-600 hover:text-primary-700 focus:outline-none"
          >
            {isResetPassword ? (
              'Back to login'
            ) : isLogin ? (
              "Don't have an account? Sign up"
            ) : (
              'Already have an account? Log in'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}