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

  useEffect(() => {
    if (!mounted.current || initialized.current) return;

    const detectTimezone = () => {
      try {
        const detectedTimezone = getTimezone();
        
        if (mounted.current) {
          setTimezone(detectedTimezone);
          setError(null);
          initialized.current = true;
          setLoading(false);
        }
      } catch (err) {
        console.warn('Failed to detect timezone:', err);
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
      const handleLoad = () => {
        detectTimezone();
        window.removeEventListener('load', handleLoad);
      };
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <TimezoneContext.Provider value={{ timezone, loading, error }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export const useTimezone = () => useContext(TimezoneContext);