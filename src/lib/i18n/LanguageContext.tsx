import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Language, Translation, languages, defaultLanguage } from './translations';
import toast from 'react-hot-toast';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string, params?: Record<string, string | number>) => string;
  timezone: string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: defaultLanguage,
  setLanguage: () => {},
  translate: (key: string) => key,
  timezone: 'UTC'
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('preferred_language');
      if (stored && languages.some(l => l.language === stored)) {
        return stored as Language;
      }
    } catch (error) {
      console.warn('Failed to read language preference:', error);
    }
    return defaultLanguage;
  });

  const [timezone, setTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch (error) {
      console.warn('Failed to detect timezone:', error);
      return 'UTC';
    }
  });

  // Use refs to track initialization and prevent unnecessary updates
  const isInitialized = useRef(false);
  const lastTimezoneCheck = useRef(Date.now());
  const timezoneCheckInterval = useRef<number>();
  const timezoneCheckThreshold = 1000; // 1 second between checks

  const updateDocumentLang = useCallback((lang: string) => {
    try {
      if (document?.documentElement) {
        document.documentElement.lang = lang;
      }
    } catch (error) {
      console.warn('Failed to update document language:', error);
    }
  }, []);

  const detectTimezone = useCallback(() => {
    try {
      // Prevent rapid consecutive checks
      const now = Date.now();
      if (now - lastTimezoneCheck.current < timezoneCheckThreshold) {
        return;
      }
      lastTimezoneCheck.current = now;

      const newTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (newTimezone && newTimezone !== timezone) {
        setTimezone(newTimezone);
      }
    } catch (error) {
      console.warn('Timezone detection failed:', error);
    }
  }, [timezone]);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }
    isInitialized.current = true;

    const detectLanguageAndTimezone = async () => {
      try {
        // Only attempt detection if no preference is stored
        if (!localStorage.getItem('preferred_language')) {
          let detectedLanguage: Language = defaultLanguage;

          try {
            const browserLang = navigator.language.split('-')[0].toLowerCase();
            if (languages.some(l => l.language === browserLang)) {
              detectedLanguage = browserLang as Language;
            }
          } catch (error) {
            console.warn('Browser language detection failed:', error);
          }

          // Set and save the detected language
          setCurrentLanguage(detectedLanguage);
          try {
            localStorage.setItem('preferred_language', detectedLanguage);
            updateDocumentLang(detectedLanguage);
          } catch (error) {
            console.warn('Failed to save language preference:', error);
          }
        } else {
          // Update document language for stored preference
          updateDocumentLang(currentLanguage);
        }

        detectTimezone();
      } catch (error) {
        console.error('Language and timezone detection failed:', error);
      }
    };

    detectLanguageAndTimezone();

    // Create a more robust timezone change detection
    const handleTimezoneChange = () => {
      if (document.hidden) return;
      detectTimezone();
    };

    // Listen for timezone changes
    window.addEventListener('timezoneset', handleTimezoneChange);
    document.addEventListener('visibilitychange', handleTimezoneChange);

    // Create a MutationObserver to watch for timezone-related DOM changes
    let observer: MutationObserver | null = null;
    try {
      observer = new MutationObserver((mutations) => {
        if (document.hidden) return;
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            handleTimezoneChange();
          }
        }
      });

      // Observe the document body for changes
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    } catch (error) {
      console.warn('Failed to create MutationObserver:', error);
    }

    // Create an interval to periodically check for timezone changes
    timezoneCheckInterval.current = window.setInterval(() => {
      if (document.hidden) return;
      handleTimezoneChange();
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('timezoneset', handleTimezoneChange);
      document.removeEventListener('visibilitychange', handleTimezoneChange);
      if (observer) {
        observer.disconnect();
      }
      if (timezoneCheckInterval.current) {
        window.clearInterval(timezoneCheckInterval.current);
      }
    };
  }, [timezone, updateDocumentLang, detectTimezone, currentLanguage]);

  const setLanguage = useCallback((lang: Language) => {
    try {
      if (languages.some(l => l.language === lang)) {
        setCurrentLanguage(lang);
        localStorage.setItem('preferred_language', lang);
        updateDocumentLang(lang);
        
        // Force re-render of translated content
        window.dispatchEvent(new Event('languagechange'));
        
        // Show success message
        toast.success(`Language changed to ${languages.find(l => l.language === lang)?.name}`);
      }
    } catch (error) {
      console.error('Failed to set language:', error);
      toast.error('Failed to change language. Please try again.');
    }
  }, [updateDocumentLang]);

  const translate = useCallback((key: string, params?: Record<string, string | number>): string => {
    try {
      const language = languages.find(l => l.language === currentLanguage);
      if (!language) {
        console.warn(`Language ${currentLanguage} not found, falling back to default`);
        const defaultLang = languages.find(l => l.language === defaultLanguage);
        const translation = defaultLang?.translations[key] || key;
        return interpolateParams(translation, params);
      }
      const translation = language.translations[key] || key;
      return interpolateParams(translation, params);
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  }, [currentLanguage]);

  const interpolateParams = useCallback((text: string, params?: Record<string, string | number>): string => {
    if (!params) return text;
    return text.replace(/\{\{([^}]+)\}\}/g, (_, key) => String(params[key.trim()] ?? `{{${key}}}`));
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translate, timezone }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);