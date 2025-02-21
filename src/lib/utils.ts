import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
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