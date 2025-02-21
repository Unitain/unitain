import { nanoid } from 'nanoid';

type GAEventParams = {
  [key: string]: string | number | boolean;
};

// In-memory click tracking storage
const clickCounts = new Map<string, number>();

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

// Silent link click tracking
export const initSilentLinkTracking = () => {
  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    
    if (!link) return;

    try {
      // Generate or get unique link ID
      let linkId = link.getAttribute('data-link-id');
      if (!linkId) {
        linkId = nanoid();
        link.setAttribute('data-link-id', linkId);
      }

      // Increment click count
      const currentCount = clickCounts.get(linkId) || 0;
      clickCounts.set(linkId, currentCount + 1);

      // Track event silently
      trackEvent('link_click', {
        link_id: linkId,
        link_url: link.href,
        link_text: link.innerText || 'N/A',
        click_count: currentCount + 1,
        is_external: link.hostname !== window.location.hostname,
        timestamp: Date.now()
      });
    } catch (error) {
      // Silently handle any errors
      console.debug('Link tracking error:', error);
    }
  };

  // Use capture phase to ensure we track before any other handlers
  document.addEventListener('click', handleClick, { capture: true, passive: true });
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

// Get click statistics
export const getLinkClickStats = (linkId: string) => {
  return {
    clicks: clickCounts.get(linkId) || 0,
    id: linkId
  };
};