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
  const mutationObserver = useRef<MutationObserver | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      // Cleanup mutation observer
      if (mutationObserver.current) {
        mutationObserver.current.disconnect();
      }
    };
  }, []);

  // Safely detect timezone
  const detectTimezone = () => {
    if (!mounted.current || initialized.current || !documentReady.current) return;

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

        // Create a custom element for timezone data
        try {
          const timezoneElement = document.createElement('div');
          timezoneElement.id = 'app-timezone-data';
          timezoneElement.style.display = 'none';
          timezoneElement.dataset.timezone = detectedTimezone;
          timezoneElement.dataset.timestamp = Date.now().toString();

          // Remove any existing timezone elements
          document.querySelectorAll('#app-timezone-data').forEach(el => el.remove());

          // Append new element
          document.body.appendChild(timezoneElement);

          // Set up mutation observer to prevent external modifications
          if (mutationObserver.current) {
            mutationObserver.current.disconnect();
          }

          mutationObserver.current = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'attributes' && mutation.target === timezoneElement) {
                // Restore our data attributes if they were modified
                timezoneElement.dataset.timezone = detectedTimezone;
                timezoneElement.dataset.timestamp = Date.now().toString();
              }
            });
          });

          mutationObserver.current.observe(timezoneElement, {
            attributes: true
          });
        } catch (err) {
          console.warn('Failed to create timezone element:', err);
        }

        // Dispatch custom event for other scripts
        try {
          window.dispatchEvent(new CustomEvent('appTimezoneSet', {
            detail: { timezone: detectedTimezone }
          }));
        } catch (err) {
          console.warn('Failed to dispatch timezone event:', err);
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
      if (mutationObserver.current) {
        mutationObserver.current.disconnect();
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