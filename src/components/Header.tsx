import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "./Button";
import { UserCircle2, LogOut, User } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";


export function Header() {
  const [user, setUser] = useState(null); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  const getUserCookie = () => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [name, value] = cookie.split("=");
        if (name === "userData") {
            try {
                return JSON.parse(decodeURIComponent(value)); 

            } catch (error) {
              console.error("Error parsing userData cookie:", error);
              return null;
            }
          }
    }
    return null;
  };

  const loadUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const fullUser = { ...session.user, ...(userData || {}) };
        setUser(fullUser);
        return;
      }
    } catch (error) {
      console.error("Error loading user from Supabase:", error);
    }

    // Fallback to cookie
    const cookieUser = getUserCookie();
    if (cookieUser) {
      setUser(cookieUser);
    }
  };

  useEffect(() => {
    loadUser();

    const observer = new MutationObserver(() => {
      const cookieUser = getUserCookie();
      if (cookieUser && cookieUser?.id !== user?.id) {
        setUser(cookieUser);
      }
    });

    observer.observe(document, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") loadUser();
      if (event === "SIGNED_OUT") setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const logoutUser = async () => {
      const urlParams = new URLSearchParams(location.search);
      const returnTo = urlParams.get("returnTo");

      if (returnTo === "login") {
        await handleSignOut();
        setShowAuthModal(true);
      }
    };
    logoutUser();
  }, [location.search]);

  const clearUserSession = () => {
    setUser(null);

    const cookieOptions = [
      "Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None;",
      "Path=/; Domain=.unitain.net; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None;",
    ];

    cookieOptions.forEach(option => {
      document.cookie = `userData=; ${option}`;
    });

    console.log("✅ Session cleared: Cookies & LocalStorage removed");
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);

      localStorage.clear(); 
      clearUserSession();

      const { error } = await supabase.auth.signOut();
      if (error && error.message !== "session_not_found") {
        console.error("Sign out error:", error);
        toast.error("There was a problem signing out. Please try again.");
      } else {
        toast.success("Successfully signed out");
        window.location.reload();
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
  <>
    <header className="bg-white/80 backdrop-blur-glass border-b border-gray-200/50 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0" onClick={() => (window.location.href = "/")}>
          <button className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200">
              unitain
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 overflow-x-visible">
            <LanguageSelector />
            {user ? (
            <div className="relative flex items-center gap-2 sm:gap-3 max-w-full">
              <button type="button" className="flex items-center space-x-2 sm:space-x-3 text-gray-700 hover:text-gray-900 transition-colors duration-200 group">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="h-9 w-9 rounded-full ring-2 ring-primary-200 group-hover:ring-primary-300 transition-all duration-200" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary-50 ring-2 ring-primary-200 group-hover:ring-primary-300 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium truncate max-w-[150px]">
                  {user.email}
                </span>
              </button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  {isSigningOut ? (
                    <div className="w-4 h-4 border-2 border-primary-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-primary-900 hover:bg-primary-800 whitespace-nowrap"
                id="auth-button"
              >
                <UserCircle2 className="w-4 h-4" />
                {t("nav.signin")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>

    <AuthModal  isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
  </>
  );
}