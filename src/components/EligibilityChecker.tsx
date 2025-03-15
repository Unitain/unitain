import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from './Button';
import { isSupabaseConfigured } from '../lib/supabase';
import { AuthModal } from './AuthModal';
import { saveEligibilityCheck } from '../lib/eligibility';
import { trackEvent, trackButtonClick } from '../lib/analytics';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase'; 
import {EligibilityModal} from "./EligibilityModal"

interface EligibilityCheckerProps {
  onShowPayment: () => void;
  onShowContact: () => void;
}

type Question = {
  id: string;
  translationKey: string;
  options: string[];
  category: string;
};

const questions: Question[] = [
  // Residency Status Questions
  {
    id: 'permanent_move',
    translationKey: 'eligibility.questions.permanentMove',
    options: ['yes', 'no'],
    category: 'residency_status'
  },
  {
    id: 'deregistered',
    translationKey: 'eligibility.questions.deregistered',
    options: ['yes', 'no'],
    category: 'residency_status'
  },
  {
    id: 'previous_residence',
    translationKey: 'eligibility.questions.previousResidence',
    options: ['yes', 'no'],
    category: 'residency_status'
  },
  // Vehicle Ownership Questions
  {
    id: 'ownership_duration',
    translationKey: 'eligibility.questions.ownershipDuration',
    options: ['yes', 'no'],
    category: 'vehicle_ownership'
  },
  {
    id: 'personal_goods',
    translationKey: 'eligibility.questions.personalGoods',
    options: ['yes', 'no'],
    category: 'vehicle_ownership'
  },
  {
    id: 'registered_name',
    translationKey: 'eligibility.questions.registeredName',
    options: ['yes', 'no'],
    category: 'vehicle_registration'
  },
  // Vehicle Registration Questions
  {
    id: 'eu_registration',
    translationKey: 'eligibility.questions.euRegistration',
    options: ['yes', 'no'],
    category: 'vehicle_registration'
  },
  {
    id: 'documentation',
    translationKey: 'eligibility.questions.documentation',
    options: ['yes', 'no'],
    category: 'vehicle_registration'
  },
  // Tax Status Questions
  {
    id: 'vat_paid',
    translationKey: 'eligibility.questions.vatPaid',
    options: ['yes', 'no'],
    category: 'tax_status'
  },
  {
    id: 'proof_documents',
    translationKey: 'eligibility.questions.proofDocuments',
    options: ['yes', 'no'],
    category: 'tax_status'
  },
  // Additional Information Questions
  {
    id: 'import_type',
    translationKey: 'eligibility.questions.importType',
    options: ['individual', 'company'],
    category: 'additional_information'
  },
  {
    id: 'additional_vehicles',
    translationKey: 'eligibility.questions.additionalVehicles',
    options: ['yes', 'no'],
    category: 'additional_information'
  },
];

function EligibilityChecker({ onShowPayment, onShowContact }: EligibilityCheckerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  // const [isEmailCopied, setIsEmailCopied] = useState(false);
  // const [isPasswordCopied, setIsPasswordCopied] = useState(false);  const paypalEmail = "sb-no7fn37881668@personal.example.com";
  // const paypalPassword = "xx!T%A5C";
  const [showImportantModal, setShowImportantModal] = useState(false);
  const [paymentProcessModal, setPaymentProcessModal] = useState(false);
  const currentQuestion = questions[currentStep];
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isEligible, setIsEligible] = useState(false)
  
  // console.log("🚀 ~ showEligibilityModal:", showEligibilityModal)

  // Check user session on component mount and when auth modal is shown
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      }

      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null); 
      }
    };

    checkUser();

    // Listen for auth state changes (e.g., login or logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null); // Reset user state on logout
      }
    });

    return () => {
      // Cleanup the auth listener
      authListener.subscription.unsubscribe();
    };
  }, [user]);

  
  const handleAnswer = useCallback(async (answer: string) => {
    if (!currentQuestion) return;
    if(currentStep === 1){
      setShowImportantModal(true)
    }

    try {
      // Update answers with the new answer
      const newAnswers = {
        ...answers,
        [currentQuestion.id]: answer,
      };
      setAnswers(newAnswers);

      // Log the updated answers for debugging
      console.log("🚀 Updated answers:", newAnswers);

      // Recalculate eligibility after updating answers
      const { isEligible: newIsEligible } = calculateEligibility(newAnswers); // Pass newAnswers to calculateEligibility
      setIsEligible(newIsEligible);

      console.log("🚀 this is isEligible", newIsEligible); // Debugging: Log the updated isEligible value

      if (currentStep < questions.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        await handleSaveResults(newAnswers);
        setShowResults(true);

        if (newIsEligible && user) {
          console.log("🚀 user?.id", user, "🚀isEligible", newIsEligible);
          setShowEligibilityModal(true); 
          
        const { error } = await supabase
        .from('users')
        .update({is_eligible: true })
        .eq('id', user?.id)

        if (!error) {
          toast.success("Eligibility saved");
          setShowEligibilityModal(true); // Show eligibility modal
        } else {
          toast.error('Failed to save eligibility check:', error);
        }
      } else {
        if (!user) {
          setShowAuthModal(true); // Show login modal if user is not logged in
        }else{
          toast.error('Based on your responses, you may not be eligible for tax exemption.');
          const { error } = await supabase
          .from('users')
          .update({ is_eligible: false })
          .eq('id', user?.id);
        if (error) {
          console.error("Error updating is_eligible to false:", error);
        }
        }
        }
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      toast.error(t('eligibility.errors.answerFailed'));
    }
  }, [currentQuestion, answers, currentStep, questions.length, t, user]);

  const calculateEligibility = useCallback((answers: Record<string, string>) => {
    const criticalQuestions = [
      'permanent_move',
      'previous_residence',
      'ownership_duration',
      'registered_name',
      'eu_registration',
      'vat_paid',
    ];

    // Log the critical questions and their answers for debugging
    console.log("🚀 Critical questions and answers:", criticalQuestions.map(q => ({ q, answer: answers[q] })));

    // Check if all critical questions are answered with "yes"
    const isEligible = criticalQuestions.every((q) => answers[q] === 'yes');
    const needsMoreInfo = Object.keys(answers).length < questions.length;

    if (!isEligible) {
      setError('Based on your responses, you may not be eligible for tax exemption.');
    } else {
      setError(null);
    }

    return {
      isEligible,
      needsMoreInfo,
    };
  }, []);

  const handleSaveResults = async (finalAnswers: Record<string, string>) => {
    if (!finalAnswers || Object.keys(finalAnswers).length === 0) {
      setError(t('eligibility.errors.noAnswers'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { isEligible, needsMoreInfo } = calculateEligibility(finalAnswers);
    try {
      // Save results logic here
    } catch (err) {
      console.error('Error in handleSaveResults:', err);
      setError(t('eligibility.errors.saveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = useCallback(() => {
    trackButtonClick('previous_question', {
      current_step: currentStep,
      category: currentQuestion?.category,
    });
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setShowResults(false);
    setError(null);
  }, [currentStep, currentQuestion]);

  const handleActionButton = useCallback(() => {
    const { isEligible } = calculateEligibility(answers);
    trackButtonClick(isEligible ? 'proceed_to_payment' : 'contact_support', {
      is_eligible: isEligible,
    });
    if (isEligible) {
      onShowPayment();
    } else {
      onShowContact();
    }
  }, [calculateEligibility, onShowPayment, onShowContact, answers]);

  const handleImportantModalClose = () => {
    setShowImportantModal(false);
  };

  if (!currentQuestion) {
    return <div>{t('eligibility.errors.loadingFailed')}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-500">
            {t(`eligibility.categories.${currentQuestion.category}`)}
          </h3>
          <span className="text-sm text-gray-500">
            {t('eligibility.progress', { current: currentStep + 1, total: questions.length })}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">
        {t(currentQuestion.translationKey)}
      </h2>

      <div className="space-y-4">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="w-full p-4 text-left border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            type="button"
          >
            {t(`eligibility.options.${option}`)}
          </button>
        ))}
      </div>

      {currentStep > 0 && (
        <div className="mt-6">
      <Button 
            onClick={handlePrevious} 
            variant="secondary"
            type="button"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('eligibility.buttons.previous')}
          </Button>
        </div>
      )}

    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      onAuthSuccess={() => {
        if(isEligible){
        setShowEligibilityModal(true);
        }else{
          const upadateToFalse =async () =>{
          toast.error('Based on your responses, you may not be eligible for tax exemption.');
          const { error } = await supabase
          .from('users')
          .update({is_eligible: false })
          .eq('id', user?.id)
          }
          if(error){
            console.error("Error", error);
          }
          upadateToFalse()
        }
      }}
    />

    <EligibilityModal 
    isOpen={showEligibilityModal}
    onClose={() => setShowEligibilityModal(false)}
    />
    </div>
  );
}

export default EligibilityChecker;