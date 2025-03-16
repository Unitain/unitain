import React, { useEffect, useState } from "react";
import { useAuthStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Button } from "./Button";
import { UserCircle2, LogOut, X, User } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "react-i18next";
// import { Logo } from "./Logo";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

export function Header() {
  const { user, isLoading, setUser } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const logoutUser = async () =>{
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get('returnTo');
      if (returnTo === 'login') { 
        try {
          setIsSigningOut(true);

          localStorage.removeItem("sb-auth-token");
          localStorage.removeItem("userData");
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("pendingEligibilityCheck");
          localStorage.removeItem("feedbackSubmitted");
          localStorage.removeItem("payment_success");
          localStorage.removeItem("app_timezone");
          localStorage.removeItem("GuideModal");
          localStorage.removeItem("UploadGuideShown");
          setUser(null);

          const { error } = await supabase.auth.signOut();
          if (error && error.message !== "session_not_found") {
            console.error("Sign out error:", error);
            toast.error("There was a problem signing out. Please try again.");
          } else {
            toast.success("Successfully signed out");
          }
          setShowAuthModal(true);
        } catch (error) {
          console.error("Sign out error:", error);
          toast.error("Failed to sign out. Please try again.");
        } finally {
          setIsSigningOut(false);
        }
      }
  }
  logoutUser()
  }, [setUser, location.search]);

// console.log(user);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       // Only fetch user data if we have a valid user ID
  //       if (!user?.id) {
  //         return;
  //       }

  //       const { data, error } = await supabase
  //         .from("users")
  //         .select("*")
  //         .eq("id", user.id)
  //         .single();
  //       if (error) {
  //         console.error("Error fetching user from users table:", error);
  //         return;
  //       }
  //       if (data) {
  //         setUser({ ...user, ...data });
  //         localStorage.setItem("userData", JSON.stringify(data));
  //       }
  //     } catch (error) {
  //       console.error("Error during session check:", error);
  //     }
  //   };

  //   if (user?.id) {
  //     fetchUserData();
  //   }
  // }, [user?.id, setUser]);
  
  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent double-clicks
    try {
      setIsSigningOut(true);
      // Clear local storage first
      localStorage.removeItem("sb-auth-token");
      localStorage.removeItem("userData");
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("pendingEligibilityCheck");
      localStorage.removeItem("feedbackSubmitted");
      localStorage.removeItem("payment_success");
      localStorage.removeItem("app_timezone");
      localStorage.removeItem("GuideModal");
      localStorage.removeItem("UploadGuideShown");
      // Clear user state
      setUser(null);
      window.location.reload()
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error && error.message !== "session_not_found") {
        console.error("Sign out error:", error);
        toast.error("There was a problem signing out. Please try again.");
      } else {
        toast.success("Successfully signed out");
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
          <div className="flex-shrink-0" onClick={() => (location.href = "/")}>
          <button className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200">
              unitain
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 overflow-x-visible">
            <LanguageSelector />

            {user ? (
            <div className="relative flex items-center gap-2 sm:gap-3 max-w-full">
              <button type="button"
                className="flex items-center space-x-2 sm:space-x-3 text-gray-700 hover:text-gray-900 transition-colors duration-200 touch-manipulation group"
               >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt=""
                    className="h-9 w-9 rounded-full ring-2 ring-primary-200 group-hover:ring-primary-300 transition-all duration-200"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary-50 ring-2 ring-primary-200 group-hover:ring-primary-300 transition-all duration-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium truncate max-w-[150px]">
                  {user?.email}
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

    <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
  </>
  );
}