import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Car, CheckCircle, Clock, EuroIcon } from 'lucide-react';
import { Button } from './components/Button';
import { FAQ } from './components/FAQ';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { AuthProvider } from './components/AuthProvider';
import { useAuthStore } from './lib/store';
import { useTranslation } from 'react-i18next';

// Lazy load components
const Testimonials = lazy(() => import('./components/Testimonials').then(m => ({ default: m.Testimonials })));
const EligibilityChecker = lazy(() => import('./components/EligibilityChecker').then(m => ({ default: m.EligibilityChecker })));
const PaymentPage = lazy(() => import('./components/PaymentPage').then(m => ({ default: m.PaymentPage })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const ContactPage = lazy(() => import('./components/ContactPage').then(m => ({ default: m.ContactPage })));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./components/TermsOfService').then(m => ({ default: m.TermsOfService })));
const CookieConsent = lazy(() => import('./components/CookieConsent').then(m => ({ default: m.CookieConsent })));
const DashboardChatGPT = lazy(() => import('./components/DashboardChatGPT').then(m => ({ default: m.DashboardChatGPT })));

function AppContent() {
  const [showPayment, setShowPayment] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { user, isLoading } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const isPrivacyPage = path === '/privacy';
    const isTermsPage = path === '/terms';
    const isDashboardPage = path.includes('/dashboard/') && path.includes('/gpt');
    
    setShowPrivacy(isPrivacyPage);
    setShowTerms(isTermsPage);
    
    if (isPrivacyPage || isTermsPage) {
      setShowPayment(false);
      setShowContact(false);
    }
  }, [location]);

  const handleShowContact = () => {
    setShowContact(true);
    setShowPayment(false);
    setShowPrivacy(false);
    setShowTerms(false);
    navigate('/');
  };

  const handleShowPayment = () => {
    setShowPayment(true);
    setShowContact(false);
    setShowPrivacy(false);
    setShowTerms(false);
    navigate('/');
  };

  const handleBack = () => {
    setShowPayment(false);
    setShowContact(false);
    setShowPrivacy(false);
    setShowTerms(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <Routes>
          <Route path="/dashboard/:userId/gpt" element={<DashboardChatGPT />} />
          <Route path="/privacy" element={<PrivacyPolicy onBack={handleBack} />} />
          <Route path="/terms" element={<TermsOfService onBack={handleBack} />} />
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
        </Routes>
      </Suspense>

      <Suspense fallback={null}>
        <CookieConsent />
      </Suspense>
    </div>
  );
}

function MainContent({ handleShowContact, handleShowPayment }: { 
  handleShowContact: () => void;
  handleShowPayment: () => void;
}) {
  const { t } = useTranslation();

  const features = React.useMemo(() => [
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
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => {
                const element = document.getElementById('eligibility-checker');
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {t('hero.cta')}
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Checker Section */}
      <section id="eligibility-checker" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('eligibility.title')}
          </h2>
          <Suspense fallback={<LoadingSpinner />}>
            <EligibilityChecker 
              onShowPayment={handleShowPayment}
              onShowContact={handleShowContact}
            />
          </Suspense>
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
                <h3 className="text-xl font-semibold mb-2">
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <Suspense fallback={<LoadingSpinner />}>
          <Testimonials />
        </Suspense>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <FAQ />
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
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={handleShowContact}
              data-contact-form
            >
              {t('cta.contact')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-blue-700"
              onClick={() => navigate('/privacy')}
            >
              {t('cta.privacy')}
            </Button>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
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