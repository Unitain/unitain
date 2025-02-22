import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface TimezoneContextType {
  timezone: string;
  loading: boolean;
  error: string | null;
}

const TimezoneContext = createContext<TimezoneContextType>({
  timezone: 'UTC',
  loading: true,
  error: null
});

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [timezone, setTimezone] = useState('UTC');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const initialized = useRef(false);
  const documentReady = useRef(false);

  // Handle document ready state
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const checkDocumentReady = () => {
      documentReady.current = document.readyState === 'complete';
    };

    checkDocumentReady();

    const handleReadyStateChange = () => {
      checkDocumentReady();
      if (documentReady.current && !initialized.current) {
        detectTimezone();
      }
    };

    document.addEventListener('readystatechange', handleReadyStateChange);
    return () => {
      document.removeEventListener('readystatechange', handleReadyStateChange);
    };
  }, []);

  const detectTimezone = () => {
    try {
      if (!mounted.current || initialized.current) return;

      // Safely detect timezone
      let detectedTimezone: string;
      try {
        detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (err) {
        console.warn('Intl API timezone detection failed:', err);
        detectedTimezone = 'UTC';
      }

      if (!detectedTimezone) {
        throw new Error('Failed to detect timezone');
      }

      setTimezone(detectedTimezone);
      setError(null);
      initialized.current = true;

      // Only update document if it exists and is ready
      if (typeof document !== 'undefined' && documentReady.current) {
        try {
          const htmlElement = document.documentElement;
          if (htmlElement && typeof htmlElement.setAttribute === 'function') {
            htmlElement.setAttribute('data-timezone', detectedTimezone);
          }
        } catch (err) {
          console.warn('Failed to set timezone attribute:', err);
        }
      }
    } catch (err) {
      console.warn('Timezone detection failed:', err);
      setError('Failed to detect timezone');
      // Set UTC as fallback
      setTimezone('UTC');
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Initial detection
    if (typeof window !== 'undefined') {
      detectTimezone();
    }

    // Re-detect on visibility change
    const handleVisibilityChange = () => {
      if (
        typeof document !== 'undefined' &&
        document.visibilityState === 'visible' &&
        !initialized.current &&
        documentReady.current
      ) {
        detectTimezone();
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      mounted.current = false;
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, []);

  return (
    <TimezoneContext.Provider value={{ timezone, loading, error }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export const useTimezone = () => useContext(TimezoneContext);