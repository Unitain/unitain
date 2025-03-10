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
import { FileProvider } from '../context/FileContext';
import {FileList} from "./FileList"

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
    const feedbackSubmitted = localStorage.getItem("feedbackSubmitted");

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
    <FileProvider>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {paymentDetails?.status === "approved" ||
      (uid && getStatus.payment_status) ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
         <div className="bg-white/80 backdrop-blur-glass rounded-2xl shadow-glass p-6 sm:p-8 animate-fade-in">
         
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-6 sm:mb-10">
              Document Management
            </h1>
            
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="bg-white rounded-xl shadow-neu-flat p-6 animate-slide-up">
                 <Upload />
              </div>
              <div className="bg-white rounded-xl shadow-neu-flat p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <FileList />
              </div>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white rounded-xl shadow-neu-flat p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Download />
              </div>
            </div>
          </div>
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
    </FileProvider>
  );
}

export default DashboardChatGPT;