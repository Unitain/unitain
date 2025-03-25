import { useState, useEffect, } from "react";
import { useAuthStore } from "../lib/store";
import { Upload } from "../components/Upload";
import { Download } from "../components/Download";
import { supabase } from "../lib/supabase";
import { FileProvider } from '../context/FileContext';
import { ChatSupport } from '../components/ChatSupport';
import { NextSteps } from "../components/NextSteps";
import {useSearchParams} from "react-router-dom"
import {Check} from "lucide-react"
import { useNavigate } from 'react-router-dom';

export function DashboardChatGPT() {
  const { user} = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [paymentDetail, setPaymentDetail] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
      
    if (params.session && params.userId && params.status) {
      setPaymentDetail(params)
      setShowModal(true);
    }
  }, [searchParams]);
  
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

    {showModal && (
       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
       <div className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-2xl">
         {/* Top gradient accent */}
         <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
 
         <div className="flex flex-col items-center px-8 pt-10 pb-8 text-center">
           {/* Success icon */}
           <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-200">
             <Check className="w-10 h-10 text-white" strokeWidth={3} />
           </div>
 
           <p className="mb-2 text-lg font-medium text-gray-500">Please be patient for a moment.</p>
 
           <h3 className="mb-4 text-2xl font-bold text-gray-900">Your payment has been successful</h3>
 
           <p className="mb-8 text-gray-600 text-lg">Your postage stamp is being created.</p>
 
           {/* Payment amount card */}
           <div className="w-full p-5 mb-8 bg-gray-50 rounded-xl border border-gray-100">
             <div className="flex justify-between items-center">
               <span className="text-lg font-medium text-gray-700">TOTAL</span>
               <span className="text-2xl font-bold text-gray-900">99€</span>
             </div>
           </div>
 
           <button
             onClick={() => {setShowModal(false); navigate("/", { replace: true });}}
             className="px-8 py-3 text-white text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
           >
             Close
           </button>
         </div>
       </div>
     </div>
    )}

    </FileProvider>
  );
}

export default DashboardChatGPT;