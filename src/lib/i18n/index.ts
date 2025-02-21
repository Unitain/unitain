import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { i18nConfig, fallbackLng } from './config';

// Initialize i18n instance
const initI18n = () => {
  try {
    i18n.use(initReactI18next).init(i18nConfig);
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    // Ensure we have a working instance even if initialization fails
    i18n.use(initReactI18next).init({
      lng: fallbackLng,
      resources: {
        en: {
          common: require('../../../public/locales/en/common.json'),
        },
      },
    });
  }
};

initI18n();

export { i18n };
export * from './config';
export * from './types';
export * from './hooks';