import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { getConsentSettings, saveConsentSettings, type ConsentSettings } from '../lib/consent';
import { useTranslation } from 'react-i18next';

export function CookieConsent() {
  const [settings, setSettings] = useState<ConsentSettings | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Add debug logging
    console.debug('CookieConsent: Initializing with language', i18n.language);
    
    // Delay showing the banner to prevent flashing during language detection
    const timer = setTimeout(() => {
      try {
        const storedSettings = getConsentSettings();
        console.debug('CookieConsent: Retrieved settings', storedSettings);
        
        setSettings(storedSettings);
        setIsVisible(!storedSettings);
        setIsInitialized(true);
        
        console.debug('CookieConsent: Banner visibility set to', !storedSettings);
      } catch (error) {
        console.error('CookieConsent: Error initializing', error);
        // Fail safe - hide banner on error
        setIsVisible(false);
        setIsInitialized(true);
      }
    }, 1500); // Increased delay to ensure language detection completes

    // Cleanup function
    return () => {
      clearTimeout(timer);
      console.debug('CookieConsent: Cleanup');
    };
  }, [i18n.language]); // Re-run when language changes

  const handleAccept = () => {
    try {
      console.debug('CookieConsent: Accepting all cookies');
      const newSettings = saveConsentSettings({ analytics: true });
      setSettings(newSettings);
      setIsVisible(false);
    } catch (error) {
      console.error('CookieConsent: Error saving accept settings', error);
    }
  };

  const handleDecline = () => {
    try {
      console.debug('CookieConsent: Declining optional cookies');
      const newSettings = saveConsentSettings({ analytics: false });
      setSettings(newSettings);
      setIsVisible(false);
    } catch (error) {
      console.error('CookieConsent: Error saving decline settings', error);
    }
  };

  // Don't render anything until initialized to prevent flashing
  if (!isInitialized) {
    console.debug('CookieConsent: Not yet initialized');
    return null;
  }

  // Don't render if settings exist or banner should be hidden
  if (!isVisible) {
    console.debug('CookieConsent: Banner hidden');
    return null;
  }

  return (
    <div 
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 md:p-6 animate-in fade-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 pr-8">
            <h2 
              id="cookie-consent-title" 
              className="text-lg font-semibold text-gray-900 mb-2"
              lang={i18n.language}
            >
              {t('cookies.title')}
            </h2>
            <p 
              id="cookie-consent-description" 
              className="text-gray-600 text-sm md:text-base"
              lang={i18n.language}
            >
              {t('cookies.description')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
            <Button
              variant="secondary"
              onClick={handleDecline}
              className="w-full sm:w-auto order-2 sm:order-1"
              aria-label={t('cookies.decline')}
            >
              {t('cookies.decline')}
            </Button>
            <Button
              onClick={handleAccept}
              className="w-full sm:w-auto order-1 sm:order-2"
              aria-label={t('cookies.accept')}
            >
              {t('cookies.accept')}
            </Button>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <button 
            onClick={() => {
              window.history.pushState({}, '', '/privacy');
              window.location.reload();
            }}
            className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm transition-colors"
            aria-label={t('cookies.privacyLink')}
          >
            {t('cookies.privacyLink')}
          </button>
        </div>
      </div>
    </div>
  );
}