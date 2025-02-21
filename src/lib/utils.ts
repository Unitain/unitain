import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Optimized class name merging
const classNameCache = new Map<string, string>();

export function cn(...inputs: ClassValue[]): string {
  const key = inputs.join('|');
  let className = classNameCache.get(key);
  
  if (!className) {
    className = twMerge(clsx(inputs));
    classNameCache.set(key, className);
  }
  
  return className;
}

// Optimized date formatting with caching
const dateFormatterCache = new Map<string, Intl.DateTimeFormat>();

export function formatDate(date: Date | string | number, locale: string = 'en-US', timezone?: string): string {
  try {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    };

    const cacheKey = `${locale}|${JSON.stringify(options)}`;
    let formatter = dateFormatterCache.get(cacheKey);

    if (!formatter) {
      formatter = new Intl.DateTimeFormat(locale, options);
      dateFormatterCache.set(cacheKey, formatter);
    }

    return formatter.format(dateObj);
  } catch (error) {
    console.warn('Date formatting failed:', error);
    return new Date(date).toLocaleString();
  }
}

// Optimized currency formatting with caching
const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

export function formatCurrency(amount: number, currency: string = 'EUR', locale: string = 'en-US'): string {
  try {
    const cacheKey = `${locale}|${currency}`;
    let formatter = currencyFormatterCache.get(cacheKey);

    if (!formatter) {
      formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      currencyFormatterCache.set(cacheKey, formatter);
    }

    return formatter.format(amount);
  } catch (error) {
    console.warn('Currency formatting failed:', error);
    return `${amount.toFixed(2)} ${currency}`;
  }
}