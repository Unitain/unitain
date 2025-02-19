import React, { useState, useCallback } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from './Button';
import { isSupabaseConfigured } from '../lib/supabase';
import { AuthModal } from './AuthModal';
import { saveEligibilityCheck } from '../lib/eligibility';
import toast from 'react-hot-toast';

interface EligibilityCheckerProps {
  onShowPayment: () => void;
  onShowContact: () => void;
}

type Question = {
  id: string;
  text: string;
  options: string[];
  category: string;
};

const questions: Question[] = [
  {
    id: 'permanent_move',
    text: 'Are you planning a permanent move to Portugal?',
    options: ['Yes', 'No'],
    category: 'Residency Status',
  },
  {
    id: 'deregistered',
    text: 'Have you already deregistered your main residence in your previous country?',
    options: ['Yes', 'No'],
    category: 'Residency Status',
  },
  {
    id: 'previous_residence',
    text: 'Have you lived at your previous residence for at least 6 months?',
    options: ['Yes', 'No'],
    category: 'Residency Status',
  },
  {
    id: 'ownership_duration',
    text: 'Have you owned the vehicle for at least 6 months before your move?',
    options: ['Yes', 'No'],
    category: 'Vehicle Ownership',
  },
  {
    id: 'personal_goods',
    text: 'Is this vehicle being imported as personal moving goods?',
    options: ['Yes', 'No'],
    category: 'Vehicle Ownership',
  },
  {
    id: 'registered_name',
    text: 'Is the vehicle registered in your name?',
    options: ['Yes', 'No'],
    category: 'Vehicle Ownership',
  },
  {
    id: 'eu_registration',
    text: 'Was the vehicle registered in an EU member state?',
    options: ['Yes', 'No'],
    category: 'Vehicle Registration',
  },
  {
    id: 'documentation',
    text: 'Do you have all required vehicle documentation?',
    options: ['Yes', 'No'],
    category: 'Vehicle Registration',
  },
  {
    id: 'vat_paid',
    text: 'Has VAT been fully paid in the country of origin?',
    options: ['Yes', 'No'],
    category: 'Tax Status',
  },
  {
    id: 'proof_documents',
    text: 'Do you have all necessary documentation proving your residence duration and vehicle ownership?',
    options: ['Yes', 'No'],
    category: 'Tax Status',
  },
  {
    id: 'import_type',
    text: 'Are you importing as a private individual or a company?',
    options: ['Individual', 'Company'],
    category: 'Additional Information',
  },
  {
    id: 'additional_vehicles',
    text: 'Do you plan to import additional vehicles?',
    options: ['Yes', 'No'],
    category: 'Additional Information',
  },
];

export function EligibilityChecker({ onShowPayment, onShowContact }: EligibilityCheckerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const currentQuestion = questions[currentStep];

  const handleAnswer = useCallback(async (answer: string) => {
    if (!currentQuestion) return;

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: answer,
    };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResults(true);
      await handleSaveResults(newAnswers);
    }
  }, [currentQuestion, answers, currentStep]);

  const handleSaveResults = async (finalAnswers: Record<string, string>) => {
    if (!finalAnswers || Object.keys(finalAnswers).length === 0) {
      setError('No answers to save');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { isEligible, needsMoreInfo } = calculateEligibility();
    
    const metadata = {
      completedAt: new Date().toISOString(),
      questionsAnswered: Object.keys(finalAnswers).length,
      totalQuestions: questions.length,
      needsMoreInfo,
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
      }
    };

    try {
      const saved = await saveEligibilityCheck({
        answers: finalAnswers,
        isEligible,
        metadata
      });

      if (!saved && !isSupabaseConfigured()) {
        localStorage.setItem('pendingEligibilityCheck', JSON.stringify({
          answers: finalAnswers,
          isEligible,
          metadata
        }));
        setShowAuthModal(true);
      }
    } catch (err) {
      console.error('Error in handleSaveResults:', err);
      setError('Failed to process your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setShowResults(false);
    setError(null);
  }, []);

  const calculateEligibility = useCallback(() => {
    const criticalQuestions = [
      'permanent_move',
      'previous_residence',
      'ownership_duration',
      'registered_name',
      'vat_paid',
    ];

    const isEligible = criticalQuestions.every((q) => answers[q] === 'Yes');
    const needsMoreInfo = Object.keys(answers).length < questions.length;

    return {
      isEligible,
      needsMoreInfo,
    };
  }, [answers]);

  if (!currentQuestion) {
    return <div>Error loading questions</div>;
  }

  if (showResults) {
    const { isEligible, needsMoreInfo } = calculateEligibility();
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Eligibility Assessment</h2>
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md">
            <p>{error}</p>
          </div>
        )}
        {needsMoreInfo ? (
          <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-md">
            <p>Please complete all questions for a full assessment.</p>
          </div>
        ) : isEligible ? (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-md">
            <p className="font-semibold">Based on your responses, you may be eligible for tax exemption!</p>
            <p className="mt-2">Next steps:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Prepare all required documentation</li>
              <li>Schedule a consultation with our experts</li>
              <li>Begin your application process</li>
            </ul>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md">
            <p className="font-semibold">Based on your responses, you may not be eligible for tax exemption.</p>
            <p className="mt-2">We recommend consulting with our experts to explore your options.</p>
          </div>
        )}
        <div className="flex justify-between">
          <Button 
            variant="secondary"
            onClick={handlePrevious}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Review Answers
          </Button>
          <Button 
            onClick={isEligible ? onShowPayment : onShowContact}
            disabled={isSubmitting}
          >
            {isEligible ? 'Buy Now' : 'Contact Us'}
          </Button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-500">{currentQuestion.category}</h3>
          <span className="text-sm text-gray-500">
            Question {currentStep + 1} of {questions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>

      <div className="space-y-4">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="w-full p-4 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>

      {currentStep > 0 && (
        <div className="mt-6">
          <Button onClick={handlePrevious} variant="secondary">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous Question
          </Button>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}