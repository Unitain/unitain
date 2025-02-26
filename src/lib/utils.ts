import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getTimezone(): string {
  try {
    // First try to get from localStorage to avoid re-detection
    const storedTimezone = localStorage.getItem('app_timezone');
    if (storedTimezone) return storedTimezone;

    // Try to get from Intl API with fallback
    let timezone = 'UTC';
    try {
      // Check if Intl API is available and working
      if (typeof Intl === 'object' && Intl?.DateTimeFormat) {
        const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
        if (resolvedOptions?.timeZone) {
          timezone = resolvedOptions.timeZone;
        } else {
          console.warn('Intl API returned invalid timezone');
        }
      } else {
        console.warn('Intl API not available');
      }
    } catch (err) {
      console.warn('Failed to detect timezone from Intl API:', err);
    }

    // Store detected timezone if valid
    if (timezone && timezone !== 'UTC') {
      try {
        localStorage.setItem('app_timezone', timezone);
      } catch (err) {
        console.warn('Failed to store timezone:', err);
      }
    }

    return timezone;
  } catch (error) {
    console.warn('Failed to handle timezone:', error);
    return 'UTC';
  }
}

export function formatDate(date: string | Date, locale: string = 'en-US'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: getTimezone()
    }).format(dateObj);
  } catch (error) {
    console.warn('Date formatting failed:', error);
    return new Date(date).toLocaleDateString();
  }
}