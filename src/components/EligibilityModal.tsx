import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onNavigateToDashboard: () => void;
}

export function EligibilityModal({ isOpen, onClose }: EligibilityModalProps) {
  if (!isOpen) return null;
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black font-medium">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Eligibility Assessment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              Based on your responses, you may be eligible for tax exemption!
            </p>
          </div>

          <h3 className="text-lg font-semibold mb-4">Next steps:</h3>
          <ul className="space-y-4 mb-6">
            <li className="flex items-start">
              <ArrowRight className="h-5 w-5 text-primary-600 mt-1 mr-2 flex-shrink-0" />
              <p>Use our free interactive dashboard to prepare and upload all the needed documents.</p>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-5 w-5 text-primary-600 mt-1 mr-2 flex-shrink-0" />
              <p>Read the comprehensive Guide PDF with check lists for all your preparation tasks.</p>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-5 w-5 text-primary-600 mt-1 mr-2 flex-shrink-0" />
              <p>Get support from our chat bot to check all your documents in detail.</p>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-5 w-5 text-primary-600 mt-1 mr-2 flex-shrink-0" />
              <p>Once everything is ready, start the process and secure your tax exemption and road registration in Portugal.</p>
            </li>
          </ul>

          <button
           onClick={() => window.location.href ='https://app.unitain.net/'} 
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}