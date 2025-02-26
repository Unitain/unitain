import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initScrollTracking, initExternalLinkTracking, initSilentLinkTracking } from './lib/analytics';
import { initializeConsent } from './lib/consent';
import { TimezoneProvider } from './components/TimezoneProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import './lib/i18n';

// Initialize consent management
initializeConsent();

// Initialize analytics tracking (will only work if consent is granted)
initScrollTracking();
initExternalLinkTracking();
initSilentLinkTracking();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <TimezoneProvider>
        <App />
      </TimezoneProvider>
    </ErrorBoundary>
  </StrictMode>
);