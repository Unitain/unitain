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
  const initializeTimezone = React.useCallback(async () => {
    if (!mounted.current || initialized.current) return;

    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!detectedTimezone) {
        throw new Error('Failed to detect timezone');
      }

      setTimezone(detectedTimezone);
      setError(null);

      // Ensure DOM is ready before updating attributes
      const updateDOM = () => {
        if (!mounted.current) return;
        
        try {
          const root = document.documentElement;
          if (!root) {
            throw new Error('Document root not available');
          }

          // Update timezone attribute
          root.setAttribute('data-timezone', detectedTimezone);

          // Update language attribute
          if (!root.hasAttribute('lang')) {
            root.setAttribute('lang', navigator.language);
          }

          // Set up mutation observer
          if (!mutationObserver.current && mounted.current) {
            mutationObserver.current = new MutationObserver((mutations) => {
              if (!mounted.current) return;

              for (const mutation of mutations) {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'data-timezone') {
                  const newTimezone = root.getAttribute('data-timezone');
                  if (newTimezone && newTimezone !== timezone) {
                    setTimezone(newTimezone);
                  }
                  break;
                }
              }
            });

            mutationObserver.current.observe(root, {
              attributes: true,
              attributeFilter: ['data-timezone']
            });
          }

          initialized.current = true;
          retryCount.current = 0;
        } catch (error) {
          console.warn('DOM update failed:', error);
          throw error;
        }
      };

      // Handle DOM updates based on readiness state
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          requestAnimationFrame(() => {
            try {
              updateDOM();
            } catch (error) {
              console.warn('Failed to update DOM after load:', error);
              if (retryCount.current < maxRetries) {
                retryCount.current++;
                setTimeout(initializeTimezone, retryDelay * Math.pow(2, retryCount.current));
              }
            }
          });
        }, { once: true });
      } else {
        requestAnimationFrame(() => {
          try {
            updateDOM();
          } catch (error) {
            console.warn('Failed to update DOM:', error);
            if (retryCount.current < maxRetries) {
              retryCount.current++;
              setTimeout(initializeTimezone, retryDelay * Math.pow(2, retryCount.current));
            }
          }
        });
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