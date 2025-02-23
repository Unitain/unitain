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

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
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

      // Store timezone in localStorage for persistence
      try {
        localStorage.setItem('app_timezone', detectedTimezone);
      } catch (err) {
        console.warn('Failed to store timezone in localStorage:', err);
      }

      // Update state
      if (mounted.current) {
        setTimezone(detectedTimezone);
        setError(null);
        initialized.current = true;
        setLoading(false);
      }

      // Update document attributes safely
      if (typeof document !== 'undefined' && document.documentElement) {
        try {
          // Use data attributes which are safer than custom attributes
          document.documentElement.dataset.appTimezone = detectedTimezone;
          
          // Set lang attribute if not already set
          if (!document.documentElement.lang) {
            document.documentElement.lang = navigator.language || 'en';
          }
        } catch (err) {
          console.warn('Failed to update document attributes:', err);
        }
      }
    } catch (err) {
      console.warn('Timezone detection failed:', err);
      if (mounted.current) {
        setError('Failed to detect timezone');
        setTimezone('UTC');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Try to get timezone from localStorage first
    try {
      const storedTimezone = localStorage.getItem('app_timezone');
      if (storedTimezone) {
        setTimezone(storedTimezone);
        initialized.current = true;
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Failed to read timezone from localStorage:', err);
    }

    // Initial detection if no stored timezone
    if (typeof window !== 'undefined') {
      detectTimezone();
    }

    // Re-detect on visibility change only if not initialized
    const handleVisibilityChange = () => {
      if (
        typeof document !== 'undefined' &&
        document.visibilityState === 'visible' &&
        !initialized.current
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