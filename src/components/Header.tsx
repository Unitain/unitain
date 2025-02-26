import React, { useEffect } from "react";
import { useAuthStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Button } from "./Button";
import { UserCircle2, LogOut } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";
import toast from "react-hot-toast";

export function Header() {
  const { user, isLoading, setUser } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [parsedUser, setParsedUser] = React.useState("");
  console.log("🚀 ~ Header ~ parsedUser:", parsedUser);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");

    // Check if savedUser exists and is valid
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        // Ensure parsedUser has a valid id (UUID)
        if (
          parsedUser?.id &&
          typeof parsedUser.id === "string" &&
          parsedUser.id.trim() !== ""
        ) {
          setParsedUser(parsedUser.id);
        } else {
          console.error("Invalid user ID in localStorage:", parsedUser);
          return; // Exit if the ID is invalid
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return; // Exit if parsing fails
      }
    }

    const fetchUserData = async () => {
      try {
        // Ensure parsedUser is a valid UUID before making the query

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", parsedUser)
          .maybeSingle(); // Assumes user is unique by 'id'

        console.log("🚀 ~ fetchUserData ~ data:", data);

        if (error) {
          console.error("Error fetching user from users table:", error);
          return;
        }

        setUser(data);
        localStorage.setItem("userData", JSON.stringify(data));
      } catch (error) {
        console.error("Error during session check:", error);
      }
    };

    fetchUserData();
  }, [setUser, parsedUser]); // Add parsedUser as a dependency
  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent double-clicks

    try {
      setIsSigningOut(true);
      // Clear local storage first
      localStorage.removeItem("sb-auth-token");
      localStorage.removeItem("userData");
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("pendingEligibilityCheck");
      // Clear user state
      setUser(null);
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        // Ignore session_not_found errors as we've already cleared local state
        if (error.message !== "session_not_found") {
          console.error("Sign out error:", error);
          toast.error("There was a problem signing out. Please try again.");
        }
      } else {
        // Only show success message here, not in AuthProvider
        localStorage.removeItem("userData");
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
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0" onClick={() => (location.href = "/")}>
            <Logo />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 overflow-x-visible">
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