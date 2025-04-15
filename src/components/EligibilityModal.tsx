import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { AuthModal } from "./AuthModal";
import { supabase } from '../lib/supabase';
import { useState } from 'react';
import { useAuthStore } from "../lib/store";
import toast from "react-hot-toast";
import { log } from 'console';

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  bgColor: string;
  onAuthRequired: () => void;
}

export function EligibilityModal({ isOpen, onClose, message, bgColor, onAuthRequired }: EligibilityModalProps) {
  if (!isOpen) return null;
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleNavigation = async () => {
    const checkEligible = localStorage.getItem('is_eligible')
    if(!checkEligible){
      localStorage.setItem('is_eligible', 'true')
    }

    if(user) {
      const { error } = await supabase
      .from('users')
      .update({ is_eligible: true })
      .eq('id', user?.id);
      console.log("its updating ");
      
    if(error){console.error("Error: while updating isEligible status", error);}
  
      window.location.href = "https://app.unitain.net"
      // window.location.href = "http://localhost:5174"
    } else {
      toast.error("Login first to continue to the dashboard");
      onAuthRequired();
    }
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black font-medium">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Eligibility Assessment</h2>
          <button
          onClick={() => {
            onClose();
            window.history.replaceState({}, document.title, "/");
            navigate("/");
          }}
          
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className={`${bgColor} border rounded-lg p-4 mb-6`}>
            <p className="font-medium">{message}</p>
          </div>

          <h3 className="text-lg font-semibold mb-4">Next steps:</h3>
          <ul className="space-y-4 mb-6">
            <li className="flex items-start">
              <ArrowRight className="h-5 w-5 text-primary-600 mt-1 mr-2 flex-shrink-0" />
              <p>Download our comprehensive Guide PDF with checklists for every step.</p>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-5 w-5 text-primary-600 mt-1 mr-2 flex-shrink-0" />
              <p>Prepare and upload your documents in our <span className='font-semibold'>free</span> interactive dashboard.</p>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-5 w-5 text-primary-600 mt-1 mr-2 flex-shrink-0" />
              <p>Get <span className='font-semibold'>free</span> support from our chatbot to review your documents in detail.</p>
            </li>
          </ul>
          <p className="font-semibold mb-6">It’s all free!</p>

          <button
            onClick={handleNavigation}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>

       <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
    </div>
  );
}