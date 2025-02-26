import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { getConsentSettings, saveConsentSettings, type ConsentSettings } from '../lib/consent';
import { useTranslation } from 'react-i18next';

function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const settings = getConsentSettings();
    if (!settings) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    saveConsentSettings({ analytics: true });
    setShowBanner(false);
  };

  const handleDecline = () => {
    saveConsentSettings({ analytics: false });
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {t('cookies.title')}
            </h2>
            <p className="text-gray-600 text-sm mb-4 md:mb-0 max-w-3xl">
              {t('cookies.description')}
            </p>
          </div>
          <div className="mt-4 flex flex-shrink-0 md:mt-0 md:ml-4 space-x-4">
            <Button
              variant="outline"
              onClick={handleDecline}
            >
              {t('cookies.decline')}
            </Button>
            <Button
              variant="primary"
              onClick={handleAccept}
            >
              {t('cookies.accept')}
            </Button>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <a
            href="/privacy"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {t('cookies.learnMore')}
          </a>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;