import React from 'react';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { Button } from './Button';
import { UserCircle2, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { Logo } from './Logo';
import toast from 'react-hot-toast';

export function Header() {
  const { user, isLoading, setUser } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const { translate } = useLanguage();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      
      // Clear local storage first
      localStorage.removeItem('sb-auth-token');
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('pendingEligibilityCheck');
      
      // Clear user state
      setUser(null);
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        // Ignore session_not_found errors as we've already cleared local state
        if (error.message !== 'session_not_found') {
          console.error('Sign out error:', error);
          toast.error('There was a problem signing out. Please try again.');
        }
      } else {
        toast.success('Successfully signed out');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <UserCircle2 className="w-5 h-5 text-blue-900" />
                  <span className="text-sm text-blue-900">{user.email}</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center gap-2"
                >
                  {isSigningOut ? (
                    <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  {isSigningOut ? translate('nav.signingout') : translate('nav.signout')}
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800"
                id="auth-button"
              >
                <UserCircle2 className="w-4 h-4" />
                {translate('nav.signin')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
}