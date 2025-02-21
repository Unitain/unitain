import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { SupportedLanguages } from './config';
import { i18n } from './index';

export function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(async (language: SupportedLanguages) => {
    try {
      await i18n.changeLanguage(language);
      document.documentElement.lang = language;
      return true;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    }
  }, [i18n]);

  return {
    currentLanguage: i18n.language as SupportedLanguages,
    changeLanguage,
    isRTL: i18n.dir() === 'rtl',
  };
}

export function getLanguageName(code: SupportedLanguages, inNative = false): string {
  const names: Record<SupportedLanguages, [string, string]> = {
    en: ['English', 'English'],
    de: ['German', 'Deutsch'],
    nl: ['Dutch', 'Nederlands'],
  };

  return names[code]?.[inNative ? 1 : 0] || code;
}

// Utility function to ensure valid language code
export function getSupportedLanguage(code: string): SupportedLanguages {
  return i18n.options.supportedLngs?.includes(code) 
    ? code as SupportedLanguages 
    : i18n.options.fallbackLng as SupportedLanguages;
}