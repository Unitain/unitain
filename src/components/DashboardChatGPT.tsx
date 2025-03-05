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
  const [feedback, setFeedback] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

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
      console.log("fetchSubmission is working");
      
      try {
        const { data, error } = await supabase
          .from("submission")
          .select("guide_downloaded, payment_status, submission_complete")
          .eq("id", user?.id);
          
          console.log("🚀 ~ fetchSubmission ~ data:", data)
        if (error) throw error;
  
        if (data?.length > 0) {
          setSubmissionDetails(data[0]);
          console.log("🚀 ~ fetchSubmission ~ data[0]:", data)

          
          const { guide_downloaded, payment_status, submission_complete } = data[0];
          console.log("🚀", guide_downloaded, payment_status, submission_complete)
  
          const feedbackSubmitted = localStorage.getItem("feedbackSubmitted");
          if (!feedbackSubmitted && payment_status === "paid" && submission_complete && guide_downloaded) {
            setTimeout(() => {
              setIsFeedbackModal(true);
            }, 1000);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchSubmission();
  }, []);
  

  const submitFeedback = async (e) => {
    console.log("working");
      try {
        if(name.trim() && email.trim() && feedback.trim()){
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyw_mvIcUp7ahd7QoHZGCnDho4tgbIeyZUy7DTz_KZY7SwcOFkf-daO2j8esOYH6bRtCg/exec';
        
        const response = await fetch(scriptURL, {
          method: 'POST',
          body: JSON.stringify({
            name: name,
            email: email,
            feedback: feedback,
            timestamp: new Date().toISOString()
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          mode: 'no-cors'
        });
        console.log("🚀 ~ handleSubmit ~ response:", response)
        toast.success("Your feedback has been submitted successfully.")
        localStorage.setItem("feedbackSubmitted", "true");

        setTimeout(() => {
          setFeedback('')
          setEmail('');
          setName('');
          setIsFeedbackModal(false);
        }, 2000);
      }else{
        toast.error("Please fill all the fields")
      }
      } catch (err) {
        console.error('Error submitting form:', err);
        toast.error('There was an error submitting your information. Please try again.');
      }
    };
  
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/70" onClick={() => setIsFeedbackModal(false)} />

          <div className="bg-white rounded-lg p-6 shadow-lg z-50 relative w-[90%] max-w-md">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => {setIsFeedbackModal(false); localStorage.setItem("feedbackSubmitted", "false");}}
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Give us your feedback</h2>
            <form onSubmit={(e) => {e.preventDefault(); submitFeedback();}}>
            <div className="mb-4">
                <label htmlFor="name" className="block font-semibold">
                  Name:
                </label>
                <input
                  id="name"
                  rows={4}
                  className="w-full p-2 border mt-2 rounded-md"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eame your email here..."
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block font-semibold">
                  Email:
                </label>
                <input
                  id="email"
                  rows={3}
                  className="w-full p-2 border mt-2 rounded-md"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email here..."
                />
              </div>

              <div className="mb-4">
                <label htmlFor="feedback" className="block font-semibold">
                  Feedback:
                </label>
                <textarea
                  id="feedback"
                  rows={4}
                  className="w-full p-2 border mt-2 rounded-md"
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Ehare your feedback here..."
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition w-full"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardChatGPT;
