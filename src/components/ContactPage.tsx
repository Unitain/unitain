import React from 'react';
import { ContactForm } from './ContactForm';
import { MessageSquare, Clock, Shield, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';

interface ContactPageProps {
  onBack: () => void;
}

export function ContactPage({ onBack }: ContactPageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="secondary"
          onClick={onBack}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>

        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('contact.subtitle')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center text-center p-4">
              <MessageSquare className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">{t('contact.features.consultation.title')}</h3>
              <p className="text-gray-600">{t('contact.features.consultation.description')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Clock className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">{t('contact.features.response.title')}</h3>
              <p className="text-gray-600">{t('contact.features.response.description')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Shield className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">{t('contact.features.security.title')}</h3>
              <p className="text-gray-600">{t('contact.features.security.description')}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}