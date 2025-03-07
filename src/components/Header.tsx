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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [clarity, setClarity] = useState("3");
  const [helpfulness, setHelpfulness] = useState("3");
  const [confused, setConfused] = useState(""); 
  const [moreInfo, setMoreInfo] = useState("");
  const [recommendation, setRecommendation] = useState("3");
  const [additionalComments, setAdditionalComments] = useState("");

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

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    const feedback = {
      clarity,
      helpfulness,
      confused,
      moreInfo: confused === "Yes" ? moreInfo : "",
      recommendation,
      additionalComments,
    };
    console.log("Feedback submitted:", feedback);
    toast.success("Thank you for your feedback!");
    // Mark feedback as submitted so modal is not shown again
    localStorage.setItem("feedbackSubmitted", "true");
    handleFeedbackClose();
  };

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Final Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Thank You for Testing – Quick Feedback?
              </h2>
              <button
                onClick={handleFeedbackClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="mb-6 text-gray-700">
              We really appreciate your participation in this beta! Your feedback helps us improve our service. Could you spare 1 minute to answer these five short questions?
            </p>
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Question 1 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  1) How clear was the overall beta-test flow for you? (1-5)
                </label>
                <select
                  value={clarity}
                  onChange={(e) => setClarity(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Neutral">Neutral</option>
                  <option value="unclear">Unclear</option>
                  <option value="Very clear">Very clear</option>
                </select>
              </div>

              {/* Question 2 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  2) How helpful were the explanations and pop-ups? (1-5)
                </label>
                <select
                  value={helpfulness}
                  onChange={(e) => setHelpfulness(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Not helpful">Not helpful</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Very helpful">Very helpful</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  4) Did you feel confused at any point or need more info?
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="confused"
                      value="Yes"
                      checked={confused === "Yes"}
                      onChange={(e) => setConfused(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="confused"
                      value="No"
                      checked={confused === "No"}
                      onChange={(e) => setConfused(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {confused === "Yes" && (
                  <input
                    type="text"
                    value={moreInfo}
                    onChange={(e) => setMoreInfo(e.target.value)}
                    placeholder="Please explain..."
                    className="mt-2 w-full border rounded px-3 py-2"
                  />
                )}
              </div>


              {/* Question 4 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  4) Would you recommend us based on your current experience? (1-5)
                </label>
                <select
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Not at all">Not at all</option>
                  <option value="Maybe">Maybe</option>
                  <option value="Definitely">Definitely</option>
                </select>
              </div>

              {/* Question 5 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  5) Any additional comments, suggestions, or thoughts?
                </label>
                <textarea
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  placeholder="Your comments..."
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <Button type="button" variant="secondary" onClick={handleFeedbackClose}>
                  Fill Out Later
                </Button>
                <Button type="submit" variant="primary">
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0" onClick={() => (location.href = "/")}>
            <Logo />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 overflow-x-visible">
            <Link to="/demo" className="text-blue-600 hover:text-blue-800 font-medium">
              Demo
            </Link>
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