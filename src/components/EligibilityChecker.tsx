import { useState, useCallback} from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "./Button";
import { AuthModal } from "./AuthModal";
import { trackButtonClick } from "../lib/analytics";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { EligibilityModal } from "./EligibilityModal";
import { useAuthStore } from "../lib/store";
import { supabase } from "../lib/supabase";

type Question = {
  id: string;
  translationKey: string;
  options: string[];
  category: string;
};

const questions: Question[] = [
  // Residency Status Questions
  {
    id: "permanent_move",
    translationKey: "eligibility.questions.permanentMove",
    options: ["yes", "no"],
    category: "residency_status",
  },
  {
    id: "deregistered",
    translationKey: "eligibility.questions.deregistered",
    options: ["yes", "no"],
    category: "residency_status",
  },
  {
    id: "previous_residence",
    translationKey: "eligibility.questions.previousResidence",
    options: ["yes", "no"],
    category: "residency_status",
  },
  // Vehicle Ownership Questions
  {
    id: "ownership_duration",
    translationKey: "eligibility.questions.ownershipDuration",
    options: ["yes", "no"],
    category: "vehicle_ownership",
  },
  {
    id: "personal_goods",
    translationKey: "eligibility.questions.personalGoods",
    options: ["yes", "no"],
    category: "vehicle_ownership",
  },
  {
    id: "registered_name",
    translationKey: "eligibility.questions.registeredName",
    options: ["yes", "no"],
    category: "vehicle_registration",
  },
  // Vehicle Registration Questions
  {
    id: "eu_registration",
    translationKey: "eligibility.questions.euRegistration",
    options: ["yes", "no"],
    category: "vehicle_registration",
  },
  {
    id: "documentation",
    translationKey: "eligibility.questions.documentation",
    options: ["yes", "no"],
    category: "vehicle_registration",
  },
  // Tax Status Questions
  {
    id: "vat_paid",
    translationKey: "eligibility.questions.vatPaid",
    options: ["yes", "no"],
    category: "tax_status",
  },
  {
    id: "proof_documents",
    translationKey: "eligibility.questions.proofDocuments",
    options: ["yes", "no"],
    category: "tax_status",
  },
  // Additional Information Questions
  {
    id: "import_type",
    translationKey: "eligibility.questions.importType",
    options: ["individual", "company"],
    category: "additional_information",
  },
  {
    id: "additional_vehicles",
    translationKey: "eligibility.questions.additionalVehicles",
    options: ["yes", "no"],
    category: "additional_information",
  },
];

function EligibilityChecker() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { t } = useTranslation();
  const currentQuestion = questions[currentStep];
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const { user } = useAuthStore();

  const updateEligibleStatus = async (userId: string) => {
    console.warn("updateEligibleStatus function working");
    const { error } = await supabase
      .from('users')
      .update({ is_eligible: true })
      .eq('id', userId);
  
    if(error){
      console.error("Error: while updating isEligible status", error);
      throw error; 
    }
  }


const handleAnswer = useCallback(
  async (answer: string) => {
    if (!currentQuestion) return;
    try {
      const newAnswers = { ...answers, [currentQuestion.id]: answer };
      setAnswers(newAnswers);

      const { isEligible: newIsEligible } = calculateEligibility(newAnswers);
      setIsEligible(newIsEligible);

      if (currentStep < questions.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        await handleSaveResults(newAnswers);
          setShowEligibilityModal(true);
      }
    } catch (error) {
      console.error("Error handling answer:", error);
      toast.error(t("eligibility.errors.answerFailed"));
    }
  },
  [currentQuestion, answers, currentStep, questions.length, t, user]
);

  const calculateEligibility = useCallback((answers: Record<string, string>) => {
    const criticalQuestions = [
      'permanent_move',
      'previous_residence',
      'ownership_duration',
      'registered_name',
      'eu_registration',
      'vat_paid',
    ];
    const isEligible = criticalQuestions.every((q) => answers[q] === 'yes');
    const needsMoreInfo = Object.keys(answers).length < questions.length;

    return {
      isEligible,
      needsMoreInfo,
    };
  }, []);

  const handleSaveResults = async (finalAnswers: Record<string, string>) => {
    if (!finalAnswers || Object.keys(finalAnswers).length === 0) {
      toast.error(t("eligibility.errors.noAnswers"));
      return;
    }
  };

  const handlePrevious = useCallback(() => {
    trackButtonClick("previous_question", { current_step: currentStep, category: currentQuestion?.category,});
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, [currentStep, currentQuestion]);

  if (!currentQuestion) {
    return <div>{t("eligibility.errors.loadingFailed")}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-500">{t(`eligibility.categories.${currentQuestion.category}`, {defaultValue: currentQuestion.category,})}</h3>
          <span className="text-sm text-gray-500">{t("eligibility.progress", { current: currentStep + 1,total: questions.length,})}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-primary-600 rounded-full transition-all duration-300"
            style={{width: `${((currentStep + 1) / questions.length) * 100}%`,}}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">{t(currentQuestion.translationKey as any)}</h2>

      <div className="space-y-4">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="w-full p-4 text-left border cursor-pointer rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            type="button"
          >
            {t(`eligibility.options.${option}`, { defaultValue: option })}
          </button>
        ))}
      </div>

      {currentStep > 0 && (
        <div className="mt-6">
        <Button onClick={handlePrevious} variant="secondary" type="button"><ChevronLeft className="w-4 h-4 mr-2" />{t("eligibility.buttons.previous")}</Button>
        </div>
      )}

      <EligibilityModal
        isOpen={showEligibilityModal}
        onClose={() => setShowEligibilityModal(false)}
        message={ isEligible ? "You may be eligible for a tax exemption for your vehicle!" : "You may not be eligible for tax exemption. You can still log in and reach out to our support team."}
        bgColor={ isEligible ? "bg-green-50 border-green-100 text-green-800" : "bg-gray-50 text-gary-600 border-black-100"}
        onAuthRequired={() => {
          setShowEligibilityModal(false);
          setShowAuthModal(true);
        }}
      />
 
    <AuthModal
    isOpen={showAuthModal}
    onClose={() => setShowAuthModal(false)}
    defaultView="signup"
    onSuccess={(userId) => {
      if (isEligible) {
        return updateEligibleStatus(userId);
      }
      return Promise.resolve();
    }}
   />
    </div>
  );
}

export default EligibilityChecker;