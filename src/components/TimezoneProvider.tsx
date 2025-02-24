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

  useEffect(() => {
    const detectTimezone = () => {
      if (!mounted.current || initialized.current) return;

      try {
        // Try to get timezone from Intl API first
        let detectedTimezone: string;
        try {
          detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (!detectedTimezone) throw new Error('No timezone detected');
        } catch (err) {
          console.warn('Intl API timezone detection failed:', err);
          detectedTimezone = 'UTC';
        }

        // Update state if component is still mounted
        if (mounted.current) {
          setTimezone(detectedTimezone);
          setError(null);
          initialized.current = true;
          setLoading(false);

          // Store timezone in localStorage for persistence
          try {
            localStorage.setItem('app_timezone', detectedTimezone);
          } catch (err) {
            console.warn('Failed to store timezone in localStorage:', err);
          }

          // Create a meta tag for timezone info
          try {
            let metaTag = document.querySelector('meta[name="timezone"]');
            if (!metaTag) {
              metaTag = document.createElement('meta');
              metaTag.setAttribute('name', 'timezone');
              document.head.appendChild(metaTag);
            }
            metaTag.setAttribute('content', detectedTimezone);
          } catch (err) {
            console.warn('Failed to update timezone meta tag:', err);
          }
        }
      } catch (err) {
        console.error('Timezone detection failed:', err);
        if (mounted.current) {
          setError('Failed to detect timezone');
          setTimezone('UTC');
          setLoading(false);
        }
      }
    };

    // Wait for document to be ready
    if (document.readyState === 'complete') {
      detectTimezone();
    } else {
      window.addEventListener('load', detectTimezone);
      return () => window.removeEventListener('load', detectTimezone);
    }
  }, []);

  return (
    <TimezoneContext.Provider value={{ timezone, loading, error }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export const useTimezone = () => useContext(TimezoneContext);