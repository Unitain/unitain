import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { AuthProvider } from './components/AuthProvider';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './lib/store';
import { CheckCircle, Clock, EuroIcon } from 'lucide-react';
import Success from './Success';
import Failed from './Failed';

// Lazy load components
const Testimonials = lazy(() => import('./components/Testimonials'));
const EligibilityChecker = lazy(() => import('./components/EligibilityChecker'));
const PaymentPage = lazy(() => import('./components/PaymentPage'));
const Footer = lazy(() => import('./components/Footer'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));
const FAQ = lazy(() => import('./components/FAQ'));
const DashboardChatGPT = lazy(() => import('./components/DashboardChatGPT'));
const AuthCallback = lazy(() => import('./components/AuthCallback'));

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // React.useEffect(() => {
  //   if (!isLoading && !user) {
  //     navigate('/auth/signin');
  //   }
  // }, [user, isLoading, navigate]);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <LoadingSpinner size="lg" />
  //     </div>
  //   );
  // }

  return user ? <>{children}</> : null;
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

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
            className="text-blue-600 hover:text-blue-800"
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

interface MainContentProps {
  handleShowContact: () => void;
  handleShowPayment: () => void;
}

function MainContent({ handleShowContact, handleShowPayment }: MainContentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features: Feature[] = React.useMemo(() => [
    {
      icon: CheckCircle,
      title: t('benefits.tax.title'),
      description: t('benefits.tax.description'),
    },
    {
      icon: Clock,
      title: t('benefits.paperwork.title'),
      description: t('benefits.paperwork.description'),
    },
    {
      icon: EuroIcon,
      title: t('benefits.process.title'),
      description: t('benefits.process.description'),
    },
  ], [t]);

  const processSteps = React.useMemo(() => [
    {
      step: 1,
      titleKey: 'process.step1.title',
      descriptionKey: 'process.step1.description',
    },
    {
      step: 2,
      titleKey: 'process.step2.title',
      descriptionKey: 'process.step2.description',
    },
    {
      step: 3,
      titleKey: 'process.step3.title',
      descriptionKey: 'process.step3.description',
    },
    {
      step: 4,
      titleKey: 'process.step4.title',
      descriptionKey: 'process.step4.description',
    },
  ], []);

  return (
    <div className="pb-10">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {t('hero.subtitle')}
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('eligibility-checker');
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {t('hero.cta')}
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
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
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
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('eligibility.title')}
          </h2>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <EligibilityChecker 
                onShowPayment={handleShowPayment}
                onShowContact={handleShowContact}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('process.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">
                  {t(item.titleKey)}
                </h3>
                <p className="text-gray-600">
                  {t(item.descriptionKey)}
                </p>
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
      <section id="contact" className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleShowContact}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              data-contact-form
            >
              {t('cta.contact')}
            </button>
            <button
              onClick={() => navigate('/privacy')}
              className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('cta.privacy')}
            </button>
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

  const handleShowContact = React.useCallback(() => {
    setShowContact(true);
    setShowPayment(false);
    navigate('/');
  }, [navigate]);

  const handleShowPayment = React.useCallback(() => {
    if (!user) {
      navigate('/auth/signin');
      return;
    }
    setShowPayment(true);
    setShowContact(false);
    navigate('/');
  }, [navigate, user]);

  const handleBack = React.useCallback(() => {
    setShowPayment(false);
    setShowContact(false);
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <Routes>
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <DashboardChatGPT />
              </ProtectedRoute>
            } />
            <Route path="/auth/callback" element={
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <AuthCallback />
              </Suspense>
            } />
            <Route path="/privacy" element={<PrivacyPolicy onBack={handleBack} />} />
            <Route path="/terms" element={<TermsOfService onBack={handleBack} />} />
            <Route path="/success" element={<Success onBack={handleBack} />} />
            <Route path="/failed" element={<Failed onBack={handleBack} />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
            {/* <Route path="*" element={<div>Page Not Found. Redirecting...</div>} /> */}
          </Routes>
        </Suspense>
      </ErrorBoundary>

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