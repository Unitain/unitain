import React, { useEffect, useRef, useState } from 'react';
import { paypalService } from '../lib/paypal';
import { useAuthStore } from '../lib/store';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface PayPalButtonProps {
  amount: number;
  onSuccess?: (orderData: any) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

export function PayPalButton({ 
  amount, 
  onSuccess, 
  onError, 
  onCancel 
}: PayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const { user, isInitialized } = useAuthStore();
  const { t } = useTranslation();
  const mountedRef = useRef(true);
  const retryTimeoutRef = useRef<number>();

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let timeoutId: number;

    const initializePayPalButton = async () => {
      if (!buttonContainerRef.current || !user || !isInitialized) {
        setError(t('payment.signInRequired'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Clear any existing PayPal elements
        if (buttonContainerRef.current) {
          buttonContainerRef.current.innerHTML = '';
        }

        // Validate amount
        if (!amount || amount <= 0) {
          throw new Error(t('payment.error'));
        }

        // Validate user ID
        if (!user.id) {
          throw new Error(t('payment.signInRequired'));
        }

        // Ensure PayPal client ID is configured
        if (!import.meta.env.VITE_PAYPAL_CLIENT_ID) {
          throw new Error('PayPal client ID not configured');
        }

        const buttons = await paypalService.createOrder(amount, user.id);
        
        if (!mountedRef.current) return;

        if (!buttons) {
          throw new Error(t('payment.systemError'));
        }

        await buttons.render(buttonContainerRef.current);
        
        if (!mountedRef.current) return;
        setIsLoading(false);
      } catch (error) {
        if (!mountedRef.current) return;
        
        console.error('Failed to initialize PayPal button:', error);
        setIsLoading(false);

        const errorMessage = error instanceof Error 
          ? error.message 
          : t('payment.systemError');

        setError(errorMessage);
        
        if (error instanceof Error) {
          onError?.(error);
          toast.error(errorMessage);
        }

        // Retry initialization after a delay
        if (retryTimeoutRef.current) {
          window.clearTimeout(retryTimeoutRef.current);
        }

        retryTimeoutRef.current = window.setTimeout(() => {
          if (mountedRef.current) {
            initializePayPalButton();
          }
        }, 5000);
      }
    };

    initializePayPalButton();

    return () => {
      window.clearTimeout(timeoutId);
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
      }
      paypalService.cleanup();
    };
  }, [amount, user, isInitialized, onSuccess, onError, onCancel, t]);

  if (!isInitialized || !user) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
        {t('payment.signInRequired')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
        <p className="mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[150px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 rounded-lg">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      )}
      <div 
        ref={buttonContainerRef}
        className="paypal-button-container"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
}