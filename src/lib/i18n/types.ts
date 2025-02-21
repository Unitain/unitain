import { defaultNS } from './config';
import type common from '../../../public/locales/en/common.json';

export type Translation = typeof common;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      common: Translation;
    };
  }
}