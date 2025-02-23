import React, { useState, useCallback } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from './Button';
import { isSupabaseConfigured } from '../lib/supabase';
import { AuthModal } from './AuthModal';
import { saveEligibilityCheck } from '../lib/eligibility';
import { trackEvent, trackButtonClick } from '../lib/analytics';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

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
  {
    id: 'permanent_move',
    translationKey: 'eligibility.questions.permanentMove',
    options: ['Yes', 'No'],
    category: 'Residency Status',
  },
  {
    id: 'deregistered',
    translationKey: 'eligibility.questions.deregistered',
    options: ['Yes', 'No'],
    category: 'Residency Status',
  },
  {
    id: 'previous_residence',
    translationKey: 'eligibility.questions.previousResidence',
    options: ['Yes', 'No'],
    category: 'Residency Status',
  },
  {
    id: 'ownership_duration',
    translationKey: 'eligibility.questions.ownershipDuration',
    options: ['Yes', 'No'],
    category: 'Vehicle Ownership',
  },
  {
    id: 'personal_goods',
    translationKey: 'eligibility.questions.personalGoods',
    options: ['Yes', 'No'],
    category: 'Vehicle Ownership',
  },
  {
    id: 'registered_name',
    translationKey: 'eligibility.questions.registeredName',
    options: ['Yes', 'No'],
    category: 'Vehicle Ownership',
  },
  {
    id: 'eu_registration',
    translationKey: 'eligibility.questions.euRegistration',
    options: ['Yes', 'No'],
    category: 'Vehicle Registration',
  },
  {
    id: 'documentation',
    translationKey: 'eligibility.questions.documentation',
    options: ['Yes', 'No'],
    category: 'Vehicle Registration',
  },
  {
    id: 'vat_paid',
    translationKey: 'eligibility.questions.vatPaid',
    options: ['Yes', 'No'],
    category: 'Tax Status',
  },
  {
    id: 'proof_documents',
    translationKey: 'eligibility.questions.proofDocuments',
    options: ['Yes', 'No'],
    category: 'Tax Status',
  },
  {
    id: 'import_type',
    translationKey: 'eligibility.questions.importType',
    options: ['Individual', 'Company'],
    category: 'Additional Information',
  },
  {
    id: 'additional_vehicles',
    translationKey: 'eligibility.questions.additionalVehicles',
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
  const { t } = useTranslation();

  const currentQuestion = questions[currentStep];

  const handleAnswer = useCallback(async (answer: string) => {
    if (!currentQuestion) return;

    try {
      trackEvent('eligibility_answer', {
        question_id: currentQuestion.id,
        answer: answer,
        step: currentStep + 1,
        total_steps: questions.length
      });

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
    } catch (error) {
      console.error('Error handling answer:', error);
      toast.error(t('eligibility.errors.answerFailed'));
    }
  }, [currentQuestion, answers, currentStep, questions.length, t]);

  const handleSaveResults = async (finalAnswers: Record<string, string>) => {
    if (!finalAnswers || Object.keys(finalAnswers).length === 0) {
      setError(t('eligibility.errors.noAnswers'));
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

      trackEvent('eligibility_check_complete', {
        is_eligible: isEligible,
        needs_more_info: needsMoreInfo,
        questions_answered: Object.keys(finalAnswers).length
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
      setError(t('eligibility.errors.saveFailed'));
      trackEvent('eligibility_check_error', {
        error_type: 'save_failure',
        error_message: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = useCallback(() => {
    trackButtonClick('previous_question', {
      current_step: currentStep,
      category: currentQuestion?.category
    });
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setShowResults(false);
    setError(null);
  }, [currentStep, currentQuestion]);

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

  const handleActionButton = useCallback(() => {
    const { isEligible } = calculateEligibility();
    trackButtonClick(isEligible ? 'proceed_to_payment' : 'contact_support', {
      is_eligible: isEligible
    });
    if (isEligible) {
      onShowPayment();
    } else {
      onShowContact();
    }
  }, [calculateEligibility, onShowPayment, onShowContact]);

  if (!currentQuestion) {
    return <div>{t('eligibility.errors.loadingFailed')}</div>;
  }

  if (showResults) {
    const { isEligible, needsMoreInfo } = calculateEligibility();
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">{t('eligibility.results.title')}</h2>
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md">
            <p>{error}</p>
          </div>
        )}
        {needsMoreInfo ? (
          <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-md">
            <p>{t('eligibility.results.needsMoreInfo')}</p>
          </div>
        ) : isEligible ? (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-md">
            <p className="font-semibold">{t('eligibility.results.eligible')}</p>
            <p className="mt-2">{t('eligibility.results.nextSteps')}:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>{t('eligibility.results.steps.documents')}</li>
              <li>{t('eligibility.results.steps.consultation')}</li>
              <li>{t('eligibility.results.steps.application')}</li>
            </ul>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md">
            <p className="font-semibold">{t('eligibility.results.notEligible')}</p>
            <p className="mt-2">{t('eligibility.results.consultRecommended')}</p>
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
            {t('eligibility.buttons.reviewAnswers')}
          </Button>
          <Button 
            onClick={handleActionButton}
            disabled={isSubmitting}
          >
            {isEligible ? t('eligibility.buttons.buyNow') : t('eligibility.buttons.contactUs')}
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
          <h3 className="text-sm font-medium text-gray-500">
            {t(`eligibility.categories.${currentQuestion.category.toLowerCase().replace(/\s+/g, '_')}`)}
          </h3>
          <span className="text-sm text-gray-500">
            {t('eligibility.progress', { current: currentStep + 1, total: questions.length })}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">
        {t(currentQuestion.translationKey)}
      </h2>

      {/* <button className='mb-5 border p-5 rounded-lg border-black' onClick={() => onShowPayment()}>
        click to Pay 
      </button> */}

      <div className="space-y-4">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="w-full p-4 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            type="button"
          >
            {t(`eligibility.options.${option.toLowerCase()}`)}
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
      />
    </div>
  );
}