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

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Safely detect timezone
  useEffect(() => {
    if (!mounted.current || initialized.current) return;

    try {
      const detectedTimezone = getTimezone();
      
      // Update state if component is still mounted
      if (mounted.current) {
        setTimezone(detectedTimezone);
        setError(null);
        initialized.current = true;
        setLoading(false);
      }
    } catch (err) {
      console.error('Timezone detection failed:', err);
      if (mounted.current) {
        setError('Failed to detect timezone');
        setTimezone('UTC');
        setLoading(false);
      }
    }
  }, []);

  // Re-detect on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !initialized.current) {
        const detectedTimezone = getTimezone();
        if (mounted.current) {
          setTimezone(detectedTimezone);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <TimezoneContext.Provider value={{ timezone, loading, error }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export const useTimezone = () => useContext(TimezoneContext);