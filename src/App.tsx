import React, { useState, Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Header } from "./components/Header";
import { AuthProvider } from "./components/AuthProvider";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "./lib/store";
import { CheckCircle, Clock, EuroIcon } from "lucide-react";
import Success from "./Success";
import Failed from "./Failed";
import {AuthModal} from "./components/AuthModal"; 
import EligibilityChecker from "./components/EligibilityChecker"
import {AuthCallback} from "./components/AuthCallback"
import Reset from "../Reset"

// Lazy load components
const Testimonials = lazy(() => import("./components/Testimonials"));
const PaymentPage = lazy(() => import("./components/PaymentPage"));
const Footer = lazy(() => import("./components/Footer"));
const ContactPage = lazy(() => import("./components/ContactPage"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));
const CookieConsent = lazy(() => import("./components/CookieConsent"));
const FAQ = lazy(() => import("./components/FAQ"));
const DemoPage = lazy(() => import("./components/DemoPage"));


function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);
  const navigate = useNavigate();

  // React.useEffect(() => {
  //   const handleError = () => setHasError(true);
  //   window.addEventListener("error", handleError);
  //   return () => window.removeEventListener("error", handleError);
  // }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <button
            onClick={() => {
              setHasError(false);
              // navigate('/');
            }}
            className="text-primary-600 hover:text-primary-800"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

interface Feature {
  icon: typeof CheckCircle;
  title: string;
  description: string;
}

function MainContent({ handleShowContact }: { handleShowContact: () => void }) {
  const [isChecking, setIsChecking] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuthStore();
  useEffect(()=>{
    console.log("🚀 ~ MainContent ~ user:", user)
  },[])
  const [userCookieData, setUserCookieData] = useState(null)
  interface User {is_eligible: boolean;}

  // const handleSignOut = async() =>{
  //   const { error } = await supabase.auth.signOut();
  //   if (error && error.message !== "session_not_found") {
  //     console.error("Sign out error:", error);
  //     console.log("There was a problem signing out. Please try again.");
  //     return;
  //   }
  // }
  
  // function getUserCookie() {
  //   const cookies = document.cookie.split("; ");
  //   for (let cookie of cookies) {
  //     let [name, value] = cookie.split("=");
  //     if (name === "userData") {
  //       try {
  //         return JSON.parse(decodeURIComponent(value));
  //       } catch (error) {
  //         console.error("❌ Error parsing userData cookie:", error);
  //         return null;
  //       }
  //     }
  //   }
  //   return null; 
  // }


  // useEffect(()=>{
  //   setUser(getUserCookie())
  //   const observer = new MutationObserver(() => {setUser(getUserCookie());});
  //   observer.observe(document, { subtree: true, childList: true });
  //   return () => observer.disconnect();
  // },[])
  
  // useEffect(() => {
  //   console.log("🚀 ~ isChecking:", isChecking)
    
  //   const checkUserCookie = () => {
  //     const userData = getUserCookie();
  //     if (!userData) {
  //       console.log("🚨 No user cookie found, logging out...");
  //       // handleSignOut()
  //     } else {
  //       setUser(userData);
  //     }
  //   };
  //   checkUserCookie();
  //   const observer = new MutationObserver(() => checkUserCookie());
  //   observer.observe(document, { subtree: true, childList: true });
  
  //   return () => observer.disconnect();
  // }, []);

  useEffect(()=>{
    console.log(user);
    
    console.log("user?.is_eligible", user?.is_eligible);
    
    if(user && user?.is_eligible){
      setIsChecking(user?.is_eligible)
    }else{
      setIsChecking(false)
    }
  },[user])

  const features: Feature[] = React.useMemo(
    () => [
      {
        icon: CheckCircle,
        title: t("benefits.tax.title"),
        description: t("benefits.tax.description"),
      },
      {
        icon: Clock,
        title: t("benefits.paperwork.title"),
        description: t("benefits.paperwork.description"),
      },
      {
        icon: EuroIcon,
        title: t("benefits.process.title"),
        description: t("benefits.process.description"),
      },
    ],
    [t]
  );

  const processSteps = React.useMemo(
    () => [
      {
        step: 1,
        titleKey: "process.step1.title",
        descriptionKey: "process.step1.description",
      },
      {
        step: 2,
        titleKey: "process.step2.title",
        descriptionKey: "process.step2.description",
      },
      {
        step: 3,
        titleKey: "process.step3.title",
        descriptionKey: "process.step3.description",
      },
      {
        step: 4,
        titleKey: "process.step4.title",
        descriptionKey: "process.step4.description",
      },
    ],
    []
  );

  return (
    <div>
      {/* Hero Section */}
      <header className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t("hero.subtitle")}
            </p>
            <button
             onClick={() => {
              const element = document.getElementById("eligibility-checker");
              element?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              id="start-tax-check-button"
            >
              {t("hero.cta")}
            </button>
          </div>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-white"
                >
                  <Icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Eligibility Checker Section */}
      <section id="eligibility-checker" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isChecking ? (
             <div className="flex justify-center items-center flex-col">
             <h2 className="text-3xl font-bold text-center mb-12">You can now access dashboard</h2>
             <button
               onClick={() => window.location.href = "https://app.unitain.net"}  
              //  onClick={() => window.location.href = "http://localhost:5174"}  
               className="text-white bg-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-500 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
               Go to dashboard
             </button>
           </div>
          ) : (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12">
              Checking eligibility...
            </h2>
              <EligibilityChecker/>
          </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("process.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{t(item.titleKey)}</h3>
                <p className="text-gray-600">{t(item.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <FAQ />
        </Suspense>
      </ErrorBoundary>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Testimonials />
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
          <p className="text-xl mb-8 text-primary-100">{t("cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
           <button
            // onClick={() => setShowEligibilityModal(true)}
            onClick={() => {
              const element = document.getElementById("eligibility-checker");
              element?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              data-contact-form
            >
              {t("hero.cta")}
              </button>
            <button
              onClick={handleShowContact}
              className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              data-contact-form
            >
              {t("cta.contact")}
            </button>
            {/* <button
              onClick={() => navigate("/privacy")}
              className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {t("cta.privacy")}
            </button> */}
          </div>
        </div>
      </section>

      <ErrorBoundary>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function AppContent() {
  const [showPayment, setShowPayment] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup' | 'reset'>('login'); 

  const handleShowContact = React.useCallback(() => {
    setShowContact(true);
    setShowPayment(false);
    navigate("/");
  }, [navigate]);

  const handleShowPayment = React.useCallback(() => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowPayment(true);
    setShowContact(false);
    navigate("/");
  }, [navigate, user]);

  const handleBack = React.useCallback(() => {
    setShowPayment(false);
    setShowContact(false);
    navigate("/");
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      /> */}
        <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setAuthModalView('login');
        }}
        defaultView={authModalView === 'reset' ? 'login' : authModalView}
        forceResetForm={authModalView === 'reset'}
      />

          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />}/>
            <Route path="/reset-password" element={<Reset />} />
            <Route
              path="/privacy"
              element={<PrivacyPolicy onBack={handleBack} />}
            />
            <Route
              path="/terms"
              element={<TermsOfService onBack={handleBack} />}
            />
            <Route path="/success" element={<Success onBack={handleBack} />} />
            <Route path="/failed" element={<Failed onBack={handleBack} />} />
            <Route
              path="/demo"
              element={
                <Suspense fallback={<LoadingSpinner size="lg" />}>
                  <DemoPage />
                </Suspense>
              }
            />
            <Route
              path="/"
              element={
                showContact ? (
                  <ContactPage onBack={handleBack} />
                ) : showPayment ? (
                  <PaymentPage onBack={handleBack} />
                ) : (
                  <MainContent
                    handleShowContact={handleShowContact}
                    handleShowPayment={handleShowPayment}
                  />
                )
              }
            />
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>

      <ErrorBoundary>
        <Suspense fallback={null}>
          <CookieConsent />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;