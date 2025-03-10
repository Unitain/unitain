import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import { LoadingSpinner } from "./LoadingSpinner";
import { Upload } from "./Upload";
import { Download } from "./Download";
import { Chat } from "./Chat";
import { AuthModal } from "./AuthModal";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { X } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

export function DashboardChatGPT() {
  interface PaymentDetails {
    state: "approved" | "failed";
  }
  const [submissionDetails, setSubmissionDetails] = useState(null)
  const [isFeedbackModal, setIsFeedbackModal] = useState(false)
  const { user, isInitialized } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const mounted = useRef(true);
  const url = new URL(window.location.href);
  const sessionId = url.searchParams.get("sessionId");
  const status = url.searchParams.get("status");
  const uid = url.searchParams.get("uid");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );

  const getStatus = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (!uid && getStatus.payment_status) {
      toast.error("No user ID found. Redirecting to home...");
      navigate("/");
    } else {
      setIsLoading(false);
    }
  }, [uid, navigate]);

  useEffect(() => {
    if (sessionId && status && uid) {
      setIsLoading(true);
      try {
        if (uid === user?.id) {
          const detail = { sessionId: sessionId, status: status, uid: uid };
          setPaymentDetails(detail);

          updatePaymentStatus(sessionId, status, uid);
          toast.success("Payment Successful!");
        } else {
          toast.error("Invalid payment details received.");
        }
      } catch (error) {
        toast.error("Failed to process payment details.");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    }
  }, [sessionId, status, uid, user?.id]);

  const updatePaymentStatus = async (
    paymentId: string,
    newStatus: string,
    id: string
  ) => {
    const { error } = await supabase
      .from("users")
      .update({ payment_id: paymentId, payment_status: newStatus })
      .eq("id", id);
    if (error) {
      toast.error("Error updating payment: " + error.message);
      return null;
    }
  };

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!user) {
          console.warn("No user found in dashboard, redirecting to login...");
          navigate("/auth/signin");
          return;
        }

        // Verify the session is still valid
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error || !session) {
          console.error("Session validation failed:", error);
          toast.error("Your session has expired. Please sign in again.");
          navigate("/auth/signin");
          return;
        }

        if (mounted.current) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Dashboard session check failed:", error);
        toast.error("Failed to load dashboard. Please try again.");
        navigate("/auth/signin");
      }
    };

    if (isInitialized) {
      checkSession();
    }
  }, [user, isInitialized, navigate]);

  useEffect(() => {
    console.log(user?.id);
    
    if(!user?.id) return;
    
    const fetchSubmission = async () => {
      try {
        const { data, error } = await supabase
          .from("submission")
          .select("guide_downloaded, payment_status, submission_complete")
          .eq("id", user?.id);

          if (error) throw error
        
        if (data?.length > 0) {
          setSubmissionDetails(data[0]);

          // const { guide_downloaded, payment_status, submission_complete } = data[0];
          // const feedbackSubmitted = localStorage.getItem("feedbackSubmitted");
          // console.log("🚀 this🚀  i s all ", !feedbackSubmitted, guide_downloaded, payment_status, submission_complete, feedbackSubmitted)
          // console.log("🚀🚀🚀🚀!feedbackSubmitted && payment_status  && submission_complete && guide_downloaded", !feedbackSubmitted && payment_status === "paid" && submission_complete && guide_downloaded);
          
          
          // if (!feedbackSubmitted && payment_status === "paid" && submission_complete && guide_downloaded) {
          //     setIsFeedbackModal(true);
          // }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubmission();
    console.log("🚀 data", submissionDetails);
    const feedbackSubmitted = localStorage.getItem("feedbackSubmitted");
    console.log("🚀 this🚀 i s all ", !feedbackSubmitted, submissionDetails?.guide_downloaded, submissionDetails?.payment_status, submissionDetails?.submission_complete, feedbackSubmitted)

    if (!feedbackSubmitted && submissionDetails?.payment_status === "paid" && submissionDetails?.submission_complete && submissionDetails?.guide_downloaded) {
        setIsFeedbackModal(true);
        console.log("🚀 modal open");
    }
  }, []);
  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {paymentDetails?.status === "approved" ||
      (uid && getStatus.payment_status) ? (
        <div>
          <h1 className="text-2xl font-bold mb-8">Welcome to Your Dashboard</h1>

          {/* Upload and Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
              <Upload />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Download Guide</h2>
              <Download />
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Chat Support</h2>
            <Chat />
          </div>
        </div>
      ) : (
        <div>
          {/* <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          /> */}
        </div>
      )}
      
      {isFeedbackModal && (
        <FeedbackModal 
          showFeedbackModal={isFeedbackModal} 
          setShowFeedbackModal={setIsFeedbackModal} 
        />
      )}
    </div>
  );
}

export default DashboardChatGPT;