import { loadScript } from "@paypal/paypal-js";
import toast from 'react-hot-toast';

const PAYPAL_LOAD_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

interface PayPalConfig {
  "client-id": string;
  currency: string;
  intent: "capture" | "authorize";
  components: string;
  "enable-funding"?: string;
  "disable-funding"?: string;
}

export class PayPalService {
  private static instance: PayPalService;
  private paypalPromise: Promise<any> | null = null;
  private retryCount = 0;
  private loadStartTime: number = 0;

  private constructor() {}

  static getInstance(): PayPalService {
    if (!PayPalService.instance) {
      PayPalService.instance = new PayPalService();
    }
    return PayPalService.instance;
  }

  private getConfig(): PayPalConfig {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID?.trim();
    if (!clientId) {
      throw new Error('PayPal client ID is not configured');
    }

    return {
      "client-id": clientId,
      currency: "EUR",
      intent: "capture",
      components: "buttons",
      "enable-funding": "card",
      "disable-funding": "credit,paylater"
    };
  }

  private async waitForPayPalSDK(): Promise<void> {
    let attempts = 0;
    const maxAttempts = 50;
    const interval = 100;

    while (attempts < maxAttempts) {
      if (window.paypal) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }

    throw new Error('PayPal SDK not loaded after waiting');
  }

  async initialize(retryAttempt = 0): Promise<any> {
    try {
      if (this.paypalPromise) {
        return this.paypalPromise;
      }

      // Check if PayPal is already loaded
      if (window.paypal) {
        this.paypalPromise = Promise.resolve(window.paypal);
        return this.paypalPromise;
      }

      const config = this.getConfig();
      this.loadStartTime = Date.now();

      this.paypalPromise = new Promise(async (resolve, reject) => {
        const timeoutId = setTimeout(() => {
          this.cleanup();
          reject(new Error('PayPal initialization timed out'));
        }, PAYPAL_LOAD_TIMEOUT);

        try {
          const paypalInstance = await loadScript(config);
          await this.waitForPayPalSDK();
          clearTimeout(timeoutId);
          resolve(paypalInstance);
        } catch (error) {
          clearTimeout(timeoutId);
          this.cleanup();
          reject(error);
        }
      });

      return this.paypalPromise;
    } catch (error) {
      console.error('PayPal initialization error:', error);
      this.cleanup();

      if (retryAttempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retryAttempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.initialize(retryAttempt + 1);
      }

      throw error;
    }
  }

  async createOrder(amount: number, userId: string): Promise<any> {
    try {
      const paypal = await this.initialize();
      
      if (!paypal?.Buttons) {
        throw new Error('PayPal SDK not properly initialized');
      }

      return paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay'
        },
        createOrder: (data: any, actions: any) => {
          if (!actions?.order?.create) {
            throw new Error('PayPal order creation not available');
          }

          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toFixed(2),
                currency_code: "EUR"
              },
              description: "Vehicle Tax Exemption Check",
              custom_id: userId
            }],
            application_context: {
              shipping_preference: "NO_SHIPPING"
            }
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            if (!actions?.order?.capture) {
              throw new Error('PayPal capture action not available');
            }

            const order = await actions.order.capture();
            if (order.status === 'COMPLETED') {
              toast.success('Payment successful!');
              return order;
            } else {
              throw new Error(`Payment status: ${order.status}`);
            }
          } catch (error) {
            console.error('Payment capture failed:', error);
            toast.error('We could not process your payment. Please try again.');
            throw error;
          }
        },
        onCancel: () => {
          toast.error('Payment was cancelled. Please try again when you\'re ready.');
        },
        onError: (err: any) => {
          console.error('PayPal button error:', err);
          toast.error('The payment system encountered an error. Please try again later.');
          throw err;
        }
      });
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      toast.error('Failed to initialize payment system. Please try again later.');
      throw error;
    }
  }

  cleanup(): void {
    try {
      // Remove PayPal script tags
      const scripts = document.querySelectorAll('script[src*="paypal"]');
      scripts.forEach(script => script.remove());

      // Remove PayPal iframes
      const iframes = document.querySelectorAll('iframe[name*="paypal"]');
      iframes.forEach(iframe => iframe.remove());

      // Clear PayPal-related local storage items
      Object.keys(localStorage).forEach(key => {
        if (key.toLowerCase().includes('paypal')) {
          localStorage.removeItem(key);
        }
      });

      // Reset instance state
      this.paypalPromise = null;
      this.retryCount = 0;
      this.loadStartTime = 0;

      // Clear global PayPal object
      if (window.paypal) {
        delete window.paypal;
      }
    } catch (error) {
      console.error('Error during PayPal cleanup:', error);
    }
  }
}

export const paypalService = PayPalService.getInstance();