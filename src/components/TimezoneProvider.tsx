import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getTimezone } from '../lib/utils';

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

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Safely detect timezone
  const detectTimezone = () => {
    if (!mounted.current || initialized.current || !documentReady.current) return;

    try {
      const detectedTimezone = getTimezone();
      
      // Update state if component is still mounted
      if (mounted.current) {
        setTimezone(detectedTimezone);
        setError(null);
        initialized.current = true;
        setLoading(false);

        // Create a meta tag for timezone info
        const metaTag = document.querySelector('meta[name="timezone"]') || document.createElement('meta');
        metaTag.setAttribute('name', 'timezone');
        metaTag.setAttribute('content', detectedTimezone);
        if (!metaTag.parentNode) {
          document.head.appendChild(metaTag);
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

  useEffect(() => {
    // Wait for document to be fully loaded
    const readyStateChange = () => {
      if (document.readyState === 'complete') {
        documentReady.current = true;
        // Add a small delay to ensure extensions have initialized
        setTimeout(detectTimezone, 100);
      }
    };

    if (document.readyState === 'complete') {
      documentReady.current = true;
      setTimeout(detectTimezone, 100);
    } else {
      document.addEventListener('readystatechange', readyStateChange);
    }

    // Re-detect on visibility change
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        !initialized.current &&
        documentReady.current
      ) {
        detectTimezone();
      }
    };

    // Re-detect on storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app_timezone' && e.newValue && mounted.current) {
        setTimezone(e.newValue);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      mounted.current = false;
      document.removeEventListener('readystatechange', readyStateChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <TimezoneContext.Provider value={{ timezone, loading, error }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export const useTimezone = () => useContext(TimezoneContext);