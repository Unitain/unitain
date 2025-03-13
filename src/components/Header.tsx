import React, { useEffect, useState } from "react";
import { useAuthStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Button } from "./Button";
import { UserCircle2, LogOut, X } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export function Header() {
  const { user, isLoading, setUser } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Only fetch user data if we have a valid user ID
        if (!user?.id) {
          return;
        }

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching user from users table:", error);
          return;
        }
        if (data) {
          setUser({ ...user, ...data });
          localStorage.setItem("userData", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error during session check:", error);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id, setUser]);
  
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
      // Show feedback modal if not already submitted
      if (!localStorage.getItem("feedbackSubmitted")) {
        setShowFeedbackModal(true);
      }
    }
  };

  // Handler for closing the feedback modal
  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
  };

  return (
    <header className="bg-white border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0" onClick={() => (location.href = "/")}>
            <Logo />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 overflow-x-visible">
            {/* <Link to="/demo" className="text-blue-600 hover:text-blue-800 font-medium">
              Demo
            </Link> */}
            <LanguageSelector />

            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2 sm:gap-3 max-w-full overflow-hidden">
                <div className="hidden sm:flex items-center gap-2 min-w-0">
                  <UserCircle2 className="w-5 h-5 text-blue-900 flex-shrink-0" />
                  <span className="text-sm text-blue-900 truncate">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  {isSigningOut ? (
                    <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isSigningOut ? t("nav.signingout") : t("nav.signout")}
                  </span>
                  <span className="sm:hidden">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 whitespace-nowrap"
                id="auth-button"
              >
                <UserCircle2 className="w-4 h-4" />
                {t("nav.signin")}
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