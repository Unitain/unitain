import { trackEvent } from './analytics';

export type ConsentSettings = {
  analytics: boolean;
  necessary: boolean;
  timestamp: number;
};

const CONSENT_KEY = 'cookie_consent_settings';
const CONSENT_VERSION = '1.0.0';

export const getConsentSettings = (): ConsentSettings | null => {
  try {
    console.debug('Consent: Getting stored settings');
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      console.debug('Consent: No stored settings found');
      return null;
    }
    
    const settings = JSON.parse(stored);
    if (!settings.version || settings.version !== CONSENT_VERSION) {
      console.debug('Consent: Invalid version, clearing settings');
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    
    console.debug('Consent: Retrieved valid settings', settings);
    return settings;
  } catch (error) {
    console.error('Error reading consent settings:', error);
    return null;
  }
};

export const saveConsentSettings = (settings: Partial<ConsentSettings>) => {
  try {
    console.debug('Consent: Saving settings', settings);
    const timestamp = Date.now();
    const fullSettings = {
      necessary: true, // Always required
      analytics: false, // Default to false
      timestamp,
      version: CONSENT_VERSION,
      ...settings
    };
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(fullSettings));
    
    // Track consent decision
    trackEvent('cookie_consent_update', {
      analytics_accepted: fullSettings.analytics,
      timestamp: timestamp
    });
    
    // Update GA consent state
    if (typeof window.gtag === 'function') {
      console.debug('Consent: Updating GA consent state', fullSettings.analytics);
      window.gtag('consent', 'update', {
        analytics_storage: fullSettings.analytics ? 'granted' : 'denied'
      });
    }
    
    return fullSettings;
  } catch (error) {
    console.error('Error saving consent settings:', error);
    return null;
  }
};

export const initializeConsent = () => {
  console.debug('Consent: Initializing');
  // Set default consent state to denied
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'default', {
      analytics_storage: 'denied'
    });
  }
  
  const settings = getConsentSettings();
  if (settings?.analytics) {
    // Restore previous consent if granted
    console.debug('Consent: Restoring previous consent state');
    window.gtag?.('consent', 'update', {
      analytics_storage: 'granted'
    });
  }
  
  return settings;
};