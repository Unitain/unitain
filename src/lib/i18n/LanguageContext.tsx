import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Language, Translation, languages, defaultLanguage } from './translations';
import { useTimezone } from '../../components/TimezoneProvider';
import toast from 'react-hot-toast';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: defaultLanguage,
  setLanguage: () => {},
  translate: (key: string) => key
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

  const { timezone } = useTimezone();
  const isInitialized = useRef(false);

  const updateDocumentLang = useCallback((lang: string) => {
    try {
      if (document?.documentElement) {
        document.documentElement.lang = lang;
        document.documentElement.setAttribute('data-language', lang);
        document.documentElement.setAttribute('data-timezone', timezone);
      }
    } catch (error) {
      console.warn('Failed to update document language:', error);
    }
  }, [timezone]);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }
    isInitialized.current = true;

    const detectLanguage = () => {
      try {
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

          setCurrentLanguage(detectedLanguage);
          localStorage.setItem('preferred_language', detectedLanguage);
        }

        updateDocumentLang(currentLanguage);
      } catch (error) {
        console.error('Language detection failed:', error);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', detectLanguage, { once: true });
    } else {
      detectLanguage();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', detectLanguage);
    };
  }, [currentLanguage, updateDocumentLang]);

  const setLanguage = useCallback((lang: Language) => {
    try {
      if (languages.some(l => l.language === lang)) {
        setCurrentLanguage(lang);
        localStorage.setItem('preferred_language', lang);
        updateDocumentLang(lang);
        
        window.dispatchEvent(new Event('languagechange'));
        
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
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);