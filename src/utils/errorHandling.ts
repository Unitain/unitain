import { toast } from 'react-hot-toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public severity: 'warning' | 'error' = 'error'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, context: string): void {
  console.error(`Error in ${context}:`, error);

  if (error instanceof AppError) {
    toast.error(error.message);
    return;
  }

  if (error instanceof Error) {
    toast.error('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    return;
  }

  toast.error('Ein unbekannter Fehler ist aufgetreten.');
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === maxRetries) break;
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError || new Error('Operation failed after multiple retries');
}