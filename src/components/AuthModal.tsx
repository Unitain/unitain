import { useState,useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'signup';
  forceResetForm?: boolean;  
  onSuccess?: (userId: string) => Promise<void>;
}

export function AuthModal({ isOpen, onClose, defaultView = 'login', forceResetForm = false, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); 
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate()
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setEmail("");
    setPassword("");
    setAcceptedTerms(false);
    setIsLogin(defaultView === 'login');
  }, [isOpen, defaultView]);

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

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password?type=recovery&email=${encodeURIComponent(email)}`,
      });
  
      if (error) throw error;
  
      toast.success('Password reset email sent! Check your inbox.');
      setIsResetPassword(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Password reset failed");
      console.error("Password reset error:", error);
    } finally {
      setLoading(false);
    }
  };


const handleAuth = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (isResetPassword) {
      await handlePasswordReset();
    } else if (isLogin) {
      await handleLogin();
    } else {
      await handleSignup();
    }
  } catch (error) {
    console.error('Authentication error:', error);
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

  const handleSignup = async () => {
    if (!acceptedTerms) {
      throw new Error('Please accept the Terms of Use');
    }
    const is_eligible = localStorage.getItem('is_eligible')
    if(is_eligible){
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?email=${encodeURIComponent(email)}`,
          data: {
            is_eligible: !!is_eligible,
          },
        },
      });
  
      if (error) throw error;
  
      toast.success('Check your email for confirmation');
      onClose();
      navigate('/');
    }else{
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?email=${encodeURIComponent(email)}`,
        },
      });
  
      if (error) throw error;
  
      toast.success('Check your email for confirmation');
      onClose();
      navigate('/');
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
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
