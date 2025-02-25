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

    // Try to get from Intl API
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) {
      // Store for future use
      try {
        localStorage.setItem('app_timezone', timezone);
      } catch (err) {
        console.warn('Failed to store timezone:', err);
      }
      return timezone;
    }

    // Fallback to UTC if all else fails
    return 'UTC';
  } catch (error) {
    console.warn('Failed to detect timezone:', error);
    return 'UTC';
  }
}

export function formatDate(date: string | Date, locale: string = 'en-US'): string {
  try {
    const dateObj = new Date(date);
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