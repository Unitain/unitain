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
  const initialized = useRef(false);
  const mutationObserver = useRef<MutationObserver | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 3;
  const retryDelay = 1000;

  // Initialize timezone detection
  const initializeTimezone = React.useCallback(() => {
    if (!mounted.current || initialized.current) return;

    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detectedTimezone) {
        setTimezone(detectedTimezone);
        setError(null);

        // Wait for DOM to be ready
        if (document.readyState !== 'loading') {
          updateDocumentAttributes(detectedTimezone);
        } else {
          document.addEventListener('DOMContentLoaded', () => {
            updateDocumentAttributes(detectedTimezone);
          }, { once: true });
        }

        initialized.current = true;
        retryCount.current = 0;
      }
    } catch (err) {
      console.warn('Timezone detection failed:', err);
      setError('Failed to detect timezone');
      
      if (retryCount.current < maxRetries) {
        retryCount.current++;
        setTimeout(initializeTimezone, retryDelay * Math.pow(2, retryCount.current));
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // Safely update document attributes
  const updateDocumentAttributes = React.useCallback((detectedTimezone: string) => {
    if (!mounted.current) return;

    try {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const root = document.documentElement;
        if (!root) return;

        // Update timezone attribute
        const currentTimezone = root.getAttribute('data-timezone');
        if (currentTimezone !== detectedTimezone) {
          root.setAttribute('data-timezone', detectedTimezone);
        }

        // Update language attribute if missing
        if (!root.hasAttribute('lang')) {
          root.setAttribute('lang', navigator.language);
        }

        // Set up mutation observer for timezone changes
        if (!mutationObserver.current && mounted.current) {
          mutationObserver.current = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'attributes' && 
                  mutation.attributeName === 'data-timezone' &&
                  mounted.current) {
                const newTimezone = root.getAttribute('data-timezone');
                if (newTimezone && newTimezone !== timezone) {
                  setTimezone(newTimezone);
                }
              }
            });
          });

          mutationObserver.current.observe(root, {
            attributes: true,
            attributeFilter: ['data-timezone']
          });
        }
      });
    } catch (error) {
      console.warn('Failed to update document attributes:', error);
    }
  }, [timezone]);

  // Handle visibility changes
  const handleVisibilityChange = React.useCallback(() => {
    if (document.visibilityState === 'visible' && !initialized.current) {
      retryCount.current = 0;
      initializeTimezone();
    }
  }, [initializeTimezone]);

  useEffect(() => {
    // Initial setup
    initializeTimezone();

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      mounted.current = false;
      
      if (mutationObserver.current) {
        mutationObserver.current.disconnect();
        mutationObserver.current = null;
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initializeTimezone, handleVisibilityChange]);

  return (
    <TimezoneContext.Provider value={{ timezone, loading, error }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export const useTimezone = () => useContext(TimezoneContext);