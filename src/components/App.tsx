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
import { useAuthStore } from './lib/store';

function App() {
  const [showPayment, setShowPayment] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);
  const { user, isLoading } = useAuthStore();

  const handleShowContact = () => {
    setShowContact(true);
    setShowPayment(false);
  };

  const handleShowPayment = () => {
    setShowPayment(true);
    setShowContact(false);
  };

  const handleBack = () => {
    setShowPayment(false);
    setShowContact(false);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {showContact ? (
          <ContactPage onBack={handleBack} />
        ) : showPayment ? (
          <PaymentPage onBack={handleBack} />
        ) : (
          <div className="pb-10">
            {/* Hero Section */}
            <header className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    🚗 Avoid High Import Taxes – See If You Qualify in Minutes!
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-primary-100">
                    Most expats pay thousands in unnecessary car import taxes. Find out if you can skip them with our quick and hassle-free tax check.
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-primary-600 hover:bg-primary-50"
                    onClick={() => document.getElementById('eligibility-checker')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    🟢 Start Your Tax Check Now
                  </Button>
                </div>
              </div>
            </header>

            {/* Features Section */}
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6">
                    <CheckCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">✅ Save Thousands on Import Taxes</h3>
                    <p className="text-gray-600">
                      Find out in minutes if you don't have to pay Portugal's expensive car import tax.
                    </p>
                  </div>
                  <div className="text-center p-6">
                    <Clock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">📄 No Paperwork, No Headaches</h3>
                    <p className="text-gray-600">
                      We take care of all the forms and legal steps, so you don't have to deal with Portuguese bureaucracy.
                    </p>
                  </div>
                  <div className="text-center p-6">
                    <EuroIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">⚡ Fast & Simple Process</h3>
                    <p className="text-gray-600">
                      Answer a few questions now—if you qualify, we handle everything to get your car legally imported.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Eligibility Checker Section */}
            <section id="eligibility-checker" className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">Check Your Eligibility</h2>
                <EligibilityChecker 
                  onShowPayment={handleShowPayment}
                  onShowContact={handleShowContact}
                />
              </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    {
                      step: 1,
                      title: 'Check Eligibility',
                      description: 'Answer a few simple questions about your situation',
                    },
                    {
                      step: 2,
                      title: 'Submit Documents',
                      description: 'Upload required documentation through our secure platform',
                    },
                    {
                      step: 3,
                      title: 'We Process',
                      description: 'Our experts handle all communication with authorities',
                    },
                    {
                      step: 4,
                      title: 'Get Approved',
                      description: 'Receive your tax exemption confirmation',
                    },
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
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
            <section id="contact" className="py-20 bg-primary-600 text-white">
              <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Check Your Tax Exemption Eligibility?
                </h2>
                <p className="text-xl mb-8 text-primary-100">
                  Start your application today and let our experts handle the rest.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-primary-50"
                  onClick={handleShowContact}
                  data-contact-form
                >
                  Contact Us
                </Button>
              </div>
            </section>

            <Footer />
          </div>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;