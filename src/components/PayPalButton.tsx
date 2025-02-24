import React, { useEffect, useRef, useState } from 'react';
import { loadScript } from "@paypal/paypal-js";
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
  const paypalScriptLoadedRef = useRef(false);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const initializePayPal = async () => {
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

        // Get PayPal client ID from environment
        const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
        if (!clientId) {
          throw new Error('PayPal client ID not configured');
        }

        // Load PayPal script if not already loaded
        if (!paypalScriptLoadedRef.current) {
          const paypal = await loadScript({
            "client-id": clientId,
            currency: "EUR",
            intent: "capture",
            components: "buttons",
            "enable-funding": "card",
            "disable-funding": "credit,paylater"
          });

          if (!paypal) {
            throw new Error('Failed to load PayPal script');
          }

          paypalScriptLoadedRef.current = true;
          window.paypal = paypal;
        }

        // Create PayPal buttons
        const buttons = window.paypal?.Buttons({
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay'
          },
          createOrder: async () => {
            try {
              const response = await fetch('/api/create-paypal-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  amount: amount.toFixed(2),
                  userId: user.id
                }),
              });

              const order = await response.json();
              return order.id;
            } catch (error) {
              console.error('Error creating PayPal order:', error);
              throw error;
            }
          },
          onApprove: async (data: any) => {
            try {
              const response = await fetch(`/api/capture-paypal-order/${data.orderID}`, {
                method: 'POST',
              });

              const orderData = await response.json();
              if (orderData.status === 'COMPLETED') {
                onSuccess?.(orderData);
                toast.success(t('payment.success'));
              } else {
                throw new Error(`Payment status: ${orderData.status}`);
              }
            } catch (error) {
              console.error('Payment capture failed:', error);
              onError?.(error instanceof Error ? error : new Error('Payment capture failed'));
              toast.error(t('payment.error'));
            }
          },
          onCancel: () => {
            console.log('Payment cancelled');
            onCancel?.();
            toast.error(t('payment.cancelled'));
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            onError?.(err instanceof Error ? err : new Error('PayPal error'));
            toast.error(t('payment.error'));
          }
        });

        if (!buttons) {
          throw new Error('Failed to create PayPal buttons');
        }

        // Render buttons
        if (buttonContainerRef.current) {
          await buttons.render(buttonContainerRef.current);
        }
        
        if (mountedRef.current) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to initialize PayPal:', error);
        
        if (mountedRef.current) {
          setIsLoading(false);
          setError(error instanceof Error ? error.message : 'Failed to initialize payment');
          toast.error(t('payment.error'));

          // Retry initialization after delay
          retryTimeoutRef.current = window.setTimeout(() => {
            if (mountedRef.current) {
              paypalScriptLoadedRef.current = false;
              initializePayPal();
            }
          }, 5000);
        }
      }
    };

    initializePayPal();
  }, [amount, user, isInitialized, t, onSuccess, onError, onCancel]);

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
          onClick={() => {
            paypalScriptLoadedRef.current = false;
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