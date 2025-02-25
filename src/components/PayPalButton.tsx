import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { useTranslation } from 'react-i18next';
import { paypalService } from '../lib/paypal';
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
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const mountedRef = useRef(true);
  const retryTimeoutRef = useRef<number>();
  const initializationAttemptRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
      }
      paypalService.cleanup();
    };
  }, []);

  useEffect(() => {
    const initializePayPal = async () => {
      if (!buttonContainerRef.current || !user) {
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

        // Create PayPal order
        const buttons = await paypalService.createOrder(amount, user.id);

        // Render buttons
        if (buttonContainerRef.current && buttons) {
          await buttons.render(buttonContainerRef.current);
        } else {
          throw new Error('Failed to initialize PayPal buttons');
        }

        if (mountedRef.current) {
          setIsLoading(false);
          initializationAttemptRef.current = 0; // Reset attempts on success
        }
      } catch (error) {
        console.error('Failed to initialize PayPal:', error);
        
        if (mountedRef.current) {
          setIsLoading(false);
          setError(error instanceof Error ? error.message : 'Failed to initialize payment');
          toast.error(t('payment.error'));

          // Retry initialization with exponential backoff
          if (initializationAttemptRef.current < 3) {
            const delay = Math.pow(2, initializationAttemptRef.current) * 1000;
            initializationAttemptRef.current++;
            
            retryTimeoutRef.current = window.setTimeout(() => {
              if (mountedRef.current) {
                initializePayPal();
              }
            }, delay);
          }
        }
      }
    };

    initializePayPal();
  }, [amount, user, t, onSuccess, onError, onCancel]);

  if (!user) {
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
          onClick={() => {
            paypalService.cleanup();
            initializationAttemptRef.current = 0;
            setError(null);
            setIsLoading(true);
            window.location.reload();
          }}
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