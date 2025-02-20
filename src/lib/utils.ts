import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    console.warn('Date formatting failed:', error);
    return new Date(date).toLocaleString();
  }
}

export function formatCurrency(amount: number, currency: string = 'EUR', locale: string = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.warn('Currency formatting failed:', error);
    return `${amount.toFixed(2)} ${currency}`;
  }
}