import { X } from "lucide-react";
import { useState } from "react";

export const NextSteps = () => {
  // Checklist items with descriptions
  const checklistItems = [
    { title: "Vehicle Registration", description: "Upload your current vehicle registration document" },
    { title: "Proof of Ownership", description: "Provide documentation showing you own the vehicle" },
    { title: "Tax Documents", description: "Submit relevant tax documentation from your home country" },
    { title: "Identity Verification", description: "Upload your passport or national ID card" },
    { title: "Residency Proof", description: "Provide proof of your Portuguese residency" },
    { title: "Technical Inspection", description: "Upload vehicle technical inspection report" },
    { title: "Insurance Documents", description: "Provide valid vehicle insurance documentation" },
    { title: "Customs Declaration", description: "Complete and upload customs declaration forms" },
    { title: "Payment Confirmation", description: "Submit proof of payment for applicable fees" },
    { title: "Final Review", description: "Review all submitted documents before processing" },
  ];

  const [completedSteps, setCompletedSteps] = useState(Array(10).fill(false));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleStep = (index: number) => {
    const newSteps = [...completedSteps];
    newSteps[index] = !newSteps[index]; 
    setCompletedSteps(newSteps);
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-primary-900">Next Steps</h2>
        <span className="text-sm font-medium text-primary-700">
          {completedSteps.filter(Boolean).length}/10 completed
        </span>
      </div>

      {/* Few Steps Preview */}
      <div className="space-y-3 mb-6">
        {checklistItems.slice(0, 3).map((item, index) => (
          <div
            key={index}
            onClick={() => toggleStep(index)}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
              completedSteps[index] ? "bg-green-50 border-green-300" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div>
                <input type="checkbox" checked={completedSteps[index]}onChange={() => toggleStep(index)}className="h-5 w-5 cursor-pointer accent-white border border-green-700 text-black"/>
              </div>
              <div>
              <span className={`text-sm font-medium ${ completedSteps[index] ? "text-green-900" : "text-primary-900"}`}>{item.title}</span>
              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-white shadow-neu-flat hover:shadow-neu-pressed transition-all duration-200 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right h-5 w-5 text-primary-600 group-hover:text-primary-700 transition-colors duration-200 mr-2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        <span onClick={()=> {window.scrollTo({ top: 0, behavior: 'smooth' })}} className="text-primary-700 font-medium group-hover:text-primary-800 transition-colors duration-200">
          View Full Checklist
        </span>
      </button>

      {/* Modal */}
      {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white relative inset-0 rounded-lg w-96">
            <div className="bg-white w-full sticky top-0 rounded-lg flex justify-between p-5 border-b shadow-sm z-10">
                <div>
                    <h1 className="text-xl mb-2 font-semibold text-gray-900">Document Checklist</h1>
                    <p className="text-sm text-gray-600">{completedSteps.filter(Boolean).length}/10 completed</p>
                </div>
                <div className="cursor-pointer" onClick={() => setIsModalOpen(false)}>
                    <X className="text-gray-700 hover:text-gray-900"/>
                </div>
                </div>

            {/* Scrollable Checklist */}
            <div className="space-y-3 max-h-[500px] bg-white overflow-scroll p-3">
              {checklistItems.map((item, index) => (
                <div
                key={index}
                onClick={() => toggleStep(index)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                completedSteps[index] ? "bg-green-50 border-green-300" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div>
                        <input type="checkbox" checked={completedSteps[index]}onChange={() => toggleStep(index)}className="h-5 w-5 cursor-pointer accent-white border border-green-700 text-black"/>
                    </div>
                    <div>
                        <span className={`text-sm font-medium ${ completedSteps[index] ? "text-green-900" : "text-primary-900"}`}>{item.title}</span>
                        <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                    </div>
                </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
