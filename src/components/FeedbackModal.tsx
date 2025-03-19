import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


const FeedbackModal = ({showFeedbackModal, setShowFeedbackModal}) => {
    const [clarity, setClarity] = useState("3");
    const [helpfulness, setHelpfulness] = useState("3");
    const [confused, setConfused] = useState(""); 
    const [moreInfo, setMoreInfo] = useState("");
    const [recommendation, setRecommendation] = useState("3");
    const [additionalComments, setAdditionalComments] = useState("");

    const handleFeedbackClose = () => {
        setShowFeedbackModal(false);
        localStorage.setItem("feedbackSubmitted", "false")
    };

    const submitFeedback = async (e) => {
        console.log("working");
          try {
            if(clarity && helpfulness.trim() && confused){
            // const scriptURL = 'https://script.google.com/macros/s/AKfycbyw_mvIcUp7ahd7QoHZGCnDho4tgbIeyZUy7DTz_KZY7SwcOFkf-daO2j8esOYH6bRtCg/exec';
            
            // const response = await fetch(scriptURL, {
            //   method: 'POST',
            //   body: JSON.stringify({
            //     name: name,
            //     email: email,
            //     feedback: feedback,
            //     timestamp: new Date().toISOString()
            //   }),
            //   headers: {
            //     'Content-Type': 'application/json'
            //   },
            //   mode: 'no-cors'
            // });
            // console.log("🚀 ~ handleSubmit ~ response:", response)
            toast.success("Your feedback has been submitted successfully.")
            // localStorage.setItem("feedbackSubmitted", "true");
    
            setTimeout(() => {
            setShowFeedbackModal(false);
              e.preventDefault();
              const feedback = {
                clarity,
                helpfulness,
                confused,
                moreInfo: confused === "Yes" ? moreInfo : "",
                recommendation,
                additionalComments,
              };
            }, 2000);
          }else{
            toast.error("Please fill all the fields")
          }
          } catch (err) {
            console.error('Error submitting form:', err);
            toast.error('There was an error submitting your information. Please try again.');
          }
        };
      

  return (
    <div>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  Thank You for Testing – Quick Feedback?
                </h2>
                <button
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                      onClick={() => {setShowFeedbackModal(false); localStorage.setItem("feedbackSubmitted", "false");}}
                    >
                      <X className="w-6 h-6" />
                    </button>
            </div>
            <p className="mb-6 text-gray-700">
              We really appreciate your participation in this beta! Your feedback helps us improve our service. Could you spare 1 minute to answer these five short questions?
            </p>
            <form onSubmit={(e) => {e.preventDefault(); submitFeedback(); }} className="space-y-6">

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  1) How clear was the overall beta-test flow for you? (1-5)
                </label>
                <select
                  value={clarity}
                  onChange={(e) => setClarity(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Neutral">Neutral</option>
                  <option value="unclear">Unclear</option>
                  <option value="Very clear">Very clear</option>
                </select>
              </div>
        
              {/* Question 2 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  2) How helpful were the explanations and pop-ups? (1-5)
                </label>
                <select
                  value={helpfulness}
                  onChange={(e) => setHelpfulness(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Not helpful">Not helpful</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Very helpful">Very helpful</option>
                </select>
              </div>
        
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  4) Did you feel confused at any point or need more info?
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="confused"
                      value="Yes"
                      checked={confused === "Yes"}
                      onChange={(e) => setConfused(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="confused"
                      value="No"
                      checked={confused === "No"}
                      onChange={(e) => setConfused(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {confused === "Yes" && (
                  <input
                    type="text"
                    value={moreInfo}
                    onChange={(e) => setMoreInfo(e.target.value)}
                    placeholder="Please explain..."
                    className="mt-2 w-full border rounded px-3 py-2"
                  />
                )}
                    </div>
        
        
                    {/* Question 4 */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        4) Would you recommend us based on your current experience? (1-5)
                      </label>
                      <select
                        value={recommendation}
                        onChange={(e) => setRecommendation(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="Not at all">Not at all</option>
                        <option value="Maybe">Maybe</option>
                        <option value="Definitely">Definitely</option>
                      </select>
                    </div>
        
                    {/* Question 5 */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        5) Any additional comments, suggestions, or thoughts?
                      </label>
                      <textarea
                        value={additionalComments}
                        onChange={(e) => setAdditionalComments(e.target.value)}
                        placeholder="Your comments..."
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                      />
                    </div>
        
                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                      <Button type="button" variant="secondary" onClick={handleFeedbackClose}>
                        Fill Out Later
                      </Button>
                      <Button type="submit" variant="primary">
                        Submit Feedback
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
    </div>
  )
}

export default FeedbackModal
