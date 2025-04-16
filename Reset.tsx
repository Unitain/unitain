import { useState, useEffect } from 'react';
import { X } from "lucide-react";
import { supabase } from "./src/lib/supabase";
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Reset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyResetToken = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const email = searchParams.get('email');
      
      if (!(type === 'recovery' && token && email)) {
        toast.error('Invalid password reset link');
        navigate('/');
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          type: 'recovery',
          token,
          email,
        });

        if (error) throw error;
        setIsValidLink(true);
      } catch (error) {
        console.error('Error verifying token:', error);
        toast.error(error.message || 'Invalid or expired reset link');
        navigate('/');
      }
    };

    verifyResetToken();
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

    setLoading(true);

      try {
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw updateError;

        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;

        await supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            console.warn('Session still exists after sign out');
          }
        });

        toast.success('🟢 Password updated successfully! You have been logged out.');

        setTimeout(() => {
          navigate('/', { replace: true });
        }, 500);
        
      } catch (error) {
        console.error('Password reset error:', error);
        toast.error(error.message || 'Failed to update password');
      } finally {
        setLoading(false);
      }
    };

  if (!isValidLink) {
      return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>

                <h2 className="text-2xl font-bold text-center mb-4">Reset Your Password</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="inline-block animate-spin">↻</span>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Reset;
