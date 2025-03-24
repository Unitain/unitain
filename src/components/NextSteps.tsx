import { X } from "lucide-react";
import { useState } from "react";

export const NextSteps = () => {
  const checklistItems = [
    "Vehicle Registration",
    "Proof of Ownership",
    "Tax Documents",
    "Identity Verification",
    "Residency Proof",
    "Technical Inspection",
    "Insurance Documents",
    "Customs Declaration",
    "Payment Confirmation",
    "Final Review",
  ];

  const [completedSteps, setCompletedSteps] = useState(Array(10).fill(false));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleStep = (index) => {
    const newSteps = [...completedSteps];
    newSteps[index] = !newSteps[index]; // Toggle step
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
            className={`flex items-start space-x-3 rounded-lg p-3 transition-all duration-200 ${
              completedSteps[index]
                ? "bg-green-50 border-green-300"
                : "bg-white bg-opacity-50"
            }`}
          >
            <input
              type="checkbox"
              checked={completedSteps[index]}
              onChange={() => toggleStep(index)}
              className="h-5 w-5 cursor-pointer accent-white border border-green-700 text-black"
            />
            <span
              className={`text-sm font-medium ${
                completedSteps[index] ? "text-green-900" : "text-primary-900"
              }`}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-white shadow-neu-flat hover:shadow-neu-pressed transition-all duration-200 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg"width="24"height="24"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round"className="lucide lucide-arrow-right h-5 w-5 text-primary-600 group-hover:text-primary-700 transition-colors duration-200 mr-2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        <span className="text-primary-700 font-medium group-hover:text-primary-800 transition-colors duration-200">View Full Checklist</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white relative inset-0 rounded-lg w-96">
            <div className="mb-2 bg-white w-full sticky top-0 flex justify-between p-4 border-b shadow-sm z-10">
                <div>
                    <h1 className="text-xl mb-2 font-semibold text-gray-900">Document Checklist</h1>
                    <p className="text-gray-600">{completedSteps.filter(Boolean).length}/10 completed</p>
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
                  className={`flex items-center space-x-3 p-5 rounded-lg transition-all duration-200 ${
                    completedSteps[index]
                      ? "bg-green-50 border-green-300"
                      : "bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={completedSteps[index]}
                    onChange={() => toggleStep(index)}
                    className="h-5 w-5 cursor-pointer accent-white border border-green-700 text-black"
                  />
                <span
                    className={`text-sm font-medium ${
                      completedSteps[index] ? "text-green-900" : "text-primary-900"
                    }`}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
