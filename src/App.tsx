import React from 'react';
import { Car, CheckCircle, Clock, EuroIcon } from 'lucide-react';
import { Button } from './components/Button';
import { FAQ } from './components/FAQ';
import { Testimonials } from './components/Testimonials';
import { EligibilityChecker } from './components/EligibilityChecker';
import { PaymentPage } from './components/PaymentPage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { AuthProvider } from './components/AuthProvider';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { CookieConsent } from './components/CookieConsent';
import { useAuthStore } from './lib/store';
import { useLanguage } from './lib/i18n/LanguageContext';

function App() {
  const [showPayment, setShowPayment] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);
  const [showPrivacy, setShowPrivacy] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  const { user, isLoading } = useAuthStore();
  const { translate } = useLanguage();

  React.useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase();
      const isPrivacyPage = path === '/privacy' || path === '/privacy/';
      const isTermsPage = path === '/terms' || path === '/terms/';
      setShowPrivacy(isPrivacyPage);
      setShowTerms(isTermsPage);
      
      // Reset other states when showing privacy or terms
      if (isPrivacyPage || isTermsPage) {
        setShowPayment(false);
        setShowContact(false);
      }
    };

    // Initial route check
    handleRouteChange();

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleRouteChange);

    // Listen for pushstate/replacestate
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
      originalPushState.apply(history, arguments);
      handleRouteChange();
    };

    history.replaceState = function() {
      originalReplaceState.apply(history, arguments);
      handleRouteChange();
    };

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  const handleShowContact = () => {
    setShowContact(true);
    setShowPayment(false);
    setShowPrivacy(false);
    setShowTerms(false);
    window.history.pushState({}, '', '/');
  };

  const handleShowPayment = () => {
    setShowPayment(true);
    setShowContact(false);
    setShowPrivacy(false);
    setShowTerms(false);
    window.history.pushState({}, '', '/');
  };

  const handleBack = () => {
    setShowPayment(false);
    setShowContact(false);
    setShowPrivacy(false);
    setShowTerms(false);
    window.history.pushState({}, '', '/');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {showTerms ? (
          <TermsOfService onBack={handleBack} />
        ) : showPrivacy ? (
          <PrivacyPolicy onBack={handleBack} />
        ) : showContact ? (
          <ContactPage onBack={handleBack} />
        ) : showPayment ? (
          <PaymentPage onBack={handleBack} />
        ) : (
          <div className="pb-10">
            {/* Hero Section */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    {translate('hero.title')}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-blue-100">
                    {translate('hero.subtitle')}
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                    onClick={() => document.getElementById('eligibility-checker')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {translate('hero.cta')}
                  </Button>
                </div>
              </div>
            </header>

            {/* Features Section */}
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6">
                    <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{translate('benefits.tax.title')}</h3>
                    <p className="text-gray-600">
                      {translate('benefits.tax.description')}
                    </p>
                  </div>
                  <div className="text-center p-6">
                    <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{translate('benefits.paperwork.title')}</h3>
                    <p className="text-gray-600">
                      {translate('benefits.paperwork.description')}
                    </p>
                  </div>
                  <div className="text-center p-6">
                    <EuroIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{translate('benefits.process.title')}</h3>
                    <p className="text-gray-600">
                      {translate('benefits.process.description')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Eligibility Checker Section */}
            <section id="eligibility-checker" className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">
                  {translate('eligibility.title')}
                </h2>
                <EligibilityChecker 
                  onShowPayment={handleShowPayment}
                  onShowContact={handleShowContact}
                />
              </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">
                  {translate('process.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
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
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {translate(item.titleKey)}
                      </h3>
                      <p className="text-gray-600">
                        {translate(item.descriptionKey)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50">
              <Testimonials />
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
              <FAQ />
            </section>

            {/* CTA Section */}
            <section id="contact" className="py-20 bg-blue-600 text-white">
              <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold mb-4">
                  {translate('cta.title')}
                </h2>
                <p className="text-xl mb-8 text-blue-100">
                  {translate('cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                    onClick={handleShowContact}
                    data-contact-form
                  >
                    {translate('cta.contact')}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent text-white border-white hover:bg-blue-700"
                    onClick={() => {
                      window.history.pushState({}, '', '/privacy');
                      setShowPrivacy(true);
                    }}
                  >
                    {translate('cta.privacy')}
                  </Button>
                </div>
              </div>
            </section>

            <Footer />
          </div>
        )}
        
        <CookieConsent />
      </div>
    </AuthProvider>
  );
}

export default App;