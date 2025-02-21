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
  const documentReady = useRef(false);
  const mutationObserver = useRef<MutationObserver | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    mounted.current = true;

    const setupTimezone = () => {
      if (!mounted.current) return;

      try {
        // Wait for document to be ready
        if (!document.documentElement) {
          if (retryCount.current < maxRetries) {
            retryCount.current++;
            setTimeout(setupTimezone, 100 * Math.pow(2, retryCount.current));
          }
          return;
        }

        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (detectedTimezone) {
          setTimezone(detectedTimezone);
          setError(null);

          // Safely update document attributes
          const root = document.documentElement;
          if (root) {
            root.setAttribute('data-timezone', detectedTimezone);
            
            if (!root.hasAttribute('lang')) {
              root.setAttribute('lang', navigator.language);
            }
          }

          retryCount.current = 0;
        }
      } catch (err) {
        console.warn('Timezone detection failed:', err);
        setError('Failed to detect timezone');
        
        if (retryCount.current < maxRetries) {
          retryCount.current++;
          setTimeout(setupTimezone, 100 * Math.pow(2, retryCount.current));
          return;
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    const initializeTimezone = () => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          documentReady.current = true;
          setupTimezone();
        }, { once: true });
      } else {
        documentReady.current = true;
        setupTimezone();
      }

      // Only set up observer if document is available
      if (document.documentElement) {
        mutationObserver.current = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'data-timezone' &&
                mounted.current) {
              setupTimezone();
            }
          });
        });

        mutationObserver.current.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['data-timezone']
        });
      }
    };

    initializeTimezone();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && documentReady.current) {
        retryCount.current = 0;
        setupTimezone();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted.current = false;
      
      if (mutationObserver.current) {
        mutationObserver.current.disconnect();
        mutationObserver.current = null;
      }

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