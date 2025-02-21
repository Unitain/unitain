import { InitOptions } from 'i18next';
import enCommon from '../../../public/locales/en/common.json';
import deCommon from '../../../public/locales/de/common.json';
import nlCommon from '../../../public/locales/nl/common.json';

export const defaultNS = 'common';

export const fallbackLng = 'en';
export const supportedLngs = ['en', 'de', 'nl'] as const;

export type SupportedLanguages = typeof supportedLngs[number];

export const i18nConfig: InitOptions = {
  fallbackLng,
  defaultNS,
  supportedLngs,
  ns: [defaultNS],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  detection: {
    order: ['navigator'],
    caches: [], // Disable caching for faster initial load
  },
  resources: {
    en: {
      common: enCommon,
    },
    de: {
      common: deCommon,
    },
    nl: {
      common: nlCommon,
    },
  },
};