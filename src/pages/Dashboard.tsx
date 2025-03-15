import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Upload } from "../components/Upload";
import { Download } from "../components/Download";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { FileProvider } from '../context/FileContext';
import {FileList} from "../components/FileList"
import { ChatSupport } from '../components/ChatSupport';
import { ProgressTile } from '../components/ProgressTile';

export function DashboardChatGPT() {
  const [submissionDetails, setSubmissionDetails] = useState(null)
  const [isFeedbackModal, setIsFeedbackModal] = useState(false)
  const { user, isInitialized } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
    //   try {
    //     if (!user) {
    //       console.warn("No user found in dashboard, redirecting to login...");
    //       navigate("/auth/signin");
    //       return;
    //     }

    //     Verify the session is still valid
    //     const {
    //       data: { session },
    //       error,
    //     } = await supabase.auth.getSession();
    //     if (error || !session) {
    //       console.error("Session validation failed:", error);
    //       toast.error("Your session has expired. Please sign in again.");
    //       navigate("/auth/signin");
    //       return;
    //     }
    //   } catch (error) {
    //     console.error("Dashboard session check failed:", error);
    //     toast.error("Failed to load dashboard. Please try again.");
    //     navigate("/auth/signin");
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
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubmission();
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
         <div className="bg-white/80 backdrop-blur-glass rounded-2xl shadow-glass p-6 sm:p-8 animate-fade-in">
         
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-6 sm:mb-10">
              Document Management
            </h1>
            
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="bg-white rounded-xl shadow-neu-flat p-6 animate-slide-up">
                 <Upload />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3  gap-6 sm:gap-8 lg:col-span-2">
            <div className="bg-white lg:col-span-2 rounded-xl shadow-neu-flat p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <FileList />
              </div>
              <div className="bg-white rounded-xl shadow-neu-flat p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <ProgressTile />
                </div>
            </div>
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="bg-white rounded-xl shadow-neu-flat p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Download />
              </div>
            </div>
          </div>
        </div>
        </div>

      <ChatSupport/>
    </div>
    </FileProvider>
  );
}

export default DashboardChatGPT;