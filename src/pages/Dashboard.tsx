import { useState, useEffect, } from "react";
import { useAuthStore } from "../lib/store";
import { Upload } from "../components/Upload";
import { Download } from "../components/Download";
import { supabase } from "../lib/supabase";
import { FileProvider } from '../context/FileContext';
import { ChatSupport } from '../components/ChatSupport';
import { NextSteps } from "../components/NextSteps";

export function DashboardChatGPT() {
  const [submissionDetails, setSubmissionDetails] = useState(null)
  const { user} = useAuthStore();

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
  

  return (
    <FileProvider>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
         <div className="bg-white/80 backdrop-blur-glass rounded-2xl shadow-glass p-6 sm:p-8 animate-fade-in">
         
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-6 sm:mb-10">
              Document Management
            </h1>
            
          
          <div>
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="bg-white">
                 <Upload />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 mt-10"> 
              <div >
                <Download />
              </div>
                <NextSteps />
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