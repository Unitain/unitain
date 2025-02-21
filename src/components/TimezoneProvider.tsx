import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    mounted.current = true;
    
    const detectTimezone = () => {
      try {
        if (!mounted.current) return;

        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (detectedTimezone) {
          setTimezone(detectedTimezone);
          setError(null);
        }
      } catch (err) {
        console.warn('Timezone detection failed:', err);
        setError('Failed to detect timezone');
        toast.error('Unable to detect your timezone. Using UTC instead.');
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    // Initial detection
    detectTimezone();

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        detectTimezone();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      mounted.current = false;
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