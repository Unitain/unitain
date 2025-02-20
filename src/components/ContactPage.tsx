import React from 'react';
import { ContactForm } from './ContactForm';
import { MessageSquare, Clock, Shield, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '../lib/i18n/LanguageContext';

interface ContactPageProps {
  onBack: () => void;
}

export function ContactPage({ onBack }: ContactPageProps) {
  const { translate } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="secondary"
          onClick={onBack}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {translate('common.back')}
        </Button>

        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {translate('contact.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {translate('contact.subtitle')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center text-center p-4">
              <MessageSquare className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">{translate('contact.features.consultation.title')}</h3>
              <p className="text-gray-600">{translate('contact.features.consultation.description')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Clock className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">{translate('contact.features.response.title')}</h3>
              <p className="text-gray-600">{translate('contact.features.response.description')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Shield className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">{translate('contact.features.security.title')}</h3>
              <p className="text-gray-600">{translate('contact.features.security.description')}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <ContactForm />
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center text-sm text-gray-600">
            <p>{translate('contact.footer.terms')}</p>
            <p className="mt-2">{translate('contact.footer.response')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}