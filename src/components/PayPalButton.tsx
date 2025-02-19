import React, { useEffect, useRef, useState } from 'react';
import { paypalService } from '../lib/paypal';
import { useAuthStore } from '../lib/store';
import { Loader2 } from 'lucide-react';
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
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let timeoutId: number;

    const initializePayPalButton = async () => {
      if (!buttonContainerRef.current || !user || !isInitialized) return;

      try {
        setIsLoading(true);
        setError(null);

        // Clear any existing PayPal elements
        if (buttonContainerRef.current) {
          buttonContainerRef.current.innerHTML = '';
        }

        const buttons = await paypalService.createOrder(amount, user.id);
        
        if (!mountedRef.current) return;

        if (!buttons) {
          throw new Error('Failed to create PayPal buttons');
        }

        await buttons.render(buttonContainerRef.current);
        
        if (!mountedRef.current) return;
        setIsLoading(false);
      } catch (error) {
        if (!mountedRef.current) return;
        
        console.error('Failed to initialize PayPal button:', error);
        setIsLoading(false);
        setError('Failed to initialize payment system');
        
        if (error instanceof Error) {
          onError?.(error);
          toast.error(error.message);
        }

        // Retry initialization after a delay
        timeoutId = window.setTimeout(() => {
          if (mountedRef.current) {
            initializePayPalButton();
          }
        }, 5000);
      }
    };

    initializePayPalButton();

    return () => {
      window.clearTimeout(timeoutId);
      paypalService.cleanup();
    };
  }, [amount, user, isInitialized, onSuccess, onError, onCancel]);

  if (!isInitialized || !user) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
        Please sign in to continue with payment
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
        <button 
          onClick={() => window.location.reload()}
          className="block mx-auto mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Retry
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