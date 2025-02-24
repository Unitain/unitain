import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getTimezone(): string {
  try {
    // First try to get from localStorage
    const storedTimezone = localStorage.getItem('app_timezone');
    if (storedTimezone) return storedTimezone;

    // Then try to get from meta tag
    const metaTimezone = document.querySelector('meta[name="timezone"]')?.getAttribute('content');
    if (metaTimezone) return metaTimezone;

    // Finally try to get from Intl API
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) return timezone;

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