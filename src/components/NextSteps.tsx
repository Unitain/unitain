import { useEffect, useState } from "react";

export const NextSteps = () => {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-primary-900">Next Steps</h2>
        <span className="text-sm font-medium text-primary-700">0/10 completed</span>
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex items-start space-x-3 bg-white bg-opacity-50 rounded-lg p-3 transition-all duration-200 ">
          <div className="flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24"height="24"viewBox="0 0 24 24"fill="none" stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round"className="lucide lucide-circle h-5 w-5 text-primary-400"><circle cx="12" cy="12" r="10"></circle></svg>
          </div>
          <span className="text-sm font-medium text-primary-900">
            Vehicle Registration
          </span>
        </div>
        <div className="flex items-start space-x-3 bg-white bg-opacity-50 rounded-lg p-3 transition-all duration-200 ">
          <div className="flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24"height="24"viewBox="0 0 24 24"fill="none" stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round"className="lucide lucide-circle h-5 w-5 text-primary-400"><circle cx="12" cy="12" r="10"></circle></svg>
          </div>
          <span className="text-sm font-medium text-primary-900">
            Proof of Ownership
          </span>
        </div>
        <div className="flex items-start space-x-3 bg-white bg-opacity-50 rounded-lg p-3 transition-all duration-200 ">
          <div className="flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24"height="24"viewBox="0 0 24 24"fill="none" stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round"className="lucide lucide-circle h-5 w-5 text-primary-400"><circle cx="12" cy="12" r="10"></circle></svg>
          </div>
          <span className="text-sm font-medium text-primary-900">
            Tax Documents
          </span>
        </div>
      </div>
      <button className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-white shadow-neu-flat hover:shadow-neu-pressed active:shadow-neu-pressed transition-all duration-200 group">
        <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right h-5 w-5 text-primary-600 group-hover:text-primary-700 transition-colors duration-200 mr-2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        <span className="text-primary-700 font-medium group-hover:text-primary-800 transition-colors duration-200">View Full Checklist</span>
      </button>
    </div>
  );
};
