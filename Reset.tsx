import { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from "lucide-react";
import { supabase } from "./src/lib/supabase";
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Reset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

      setIsValidLink(true);
    };

    verifyResetToken();
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

    setLoading(true);

    try {
      console.log('Updating password...');
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        throw new Error('Invalid reset link - missing parameters');
      }

      // First verify the token and update password in one step
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
        new_password: password
      });
      console.log('await kay bad wali line');
      
      
      console.log('Update response:', { data, error });
      
      if (error) {
        throw error;
      }

      console.log('Password updated successfully');
      toast.success('🟢 Password updated successfully!');

      // Clear any stored data and redirect
      localStorage.clear();
      window.location.replace('/');
        
      } catch (error) {
        console.error('Password reset error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to update password');
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
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 pr-10"
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                            )}
                        </button>
                    </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 pr-10"
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                            )}
                        </button>
                    </div>
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
