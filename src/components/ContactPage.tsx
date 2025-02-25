import React from 'react';
import { Button } from './Button';
import { ContactForm } from './ContactForm';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

export function ContactPage({ onBack }: ContactPageProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-8"
      >
        {t('common.back')}
      </Button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">{t('contact.title')}</h1>
        <p className="text-gray-600 mb-8">{t('contact.subtitle')}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Features */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">
                  {t('contact.features.consultation.title')}
                </h3>
                <p className="text-gray-600">
                  {t('contact.features.consultation.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">
                  {t('contact.features.response.title')}
                </h3>
                <p className="text-gray-600">
                  {t('contact.features.response.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">
                  {t('contact.features.security.title')}
                </h3>
                <p className="text-gray-600">
                  {t('contact.features.security.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure proper default export
export default ContactPage;