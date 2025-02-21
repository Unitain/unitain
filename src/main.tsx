import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initScrollTracking, initExternalLinkTracking } from './lib/analytics';
import { initializeConsent } from './lib/consent';
import { LanguageProvider } from './lib/i18n/LanguageContext';
import { TimezoneProvider } from './components/TimezoneProvider';

// Initialize consent management
initializeConsent();

// Initialize analytics tracking (will only work if consent is granted)
initScrollTracking();
initExternalLinkTracking();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TimezoneProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </TimezoneProvider>
  </StrictMode>
);