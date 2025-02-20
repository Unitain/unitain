type GAEventParams = {
  [key: string]: string | number | boolean;
};

export const trackEvent = (
  eventName: string,
  eventParams?: GAEventParams
) => {
  try {
    if (typeof window.gtag !== 'function') {
      console.warn('Google Analytics not initialized');
      return;
    }

    window.gtag('event', eventName, eventParams);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Scroll tracking
let lastScrollPercentage = 0;
export const initScrollTracking = () => {
  const trackScroll = () => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    const thresholds = [25, 50, 75, 90];
    thresholds.forEach(threshold => {
      if (scrollPercentage >= threshold && lastScrollPercentage < threshold) {
        trackEvent('scroll_milestone', {
          percentage: threshold,
          page_location: window.location.pathname
        });
      }
    });

    lastScrollPercentage = scrollPercentage;
  };

  window.addEventListener('scroll', trackScroll, { passive: true });
};

// External link tracking
export const initExternalLinkTracking = () => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link.hostname !== window.location.hostname) {
      trackEvent('external_link_click', {
        link_url: link.href,
        link_text: link.innerText || 'N/A'
      });
    }
  });
};

// Button click tracking
export const trackButtonClick = (buttonName: string, additionalParams?: GAEventParams) => {
  trackEvent('button_click', {
    button_name: buttonName,
    ...additionalParams
  });
};