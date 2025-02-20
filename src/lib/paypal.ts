import { loadScript } from "@paypal/paypal-js";
import toast from 'react-hot-toast';
import { useLanguage } from './i18n/LanguageContext';

const PAYPAL_LOAD_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const CLEANUP_TIMEOUT = 300000; // 5 minutes

interface PayPalConfig {
  "client-id": string;
  currency: string;
  intent: "capture" | "authorize";
  components: string;
  "enable-funding"?: string;
  "disable-funding"?: string;
  locale?: string;
}

export class PayPalService {
  private static instance: PayPalService;
  private paypalPromise: Promise<any> | null = null;
  private retryCount = 0;
  private loadStartTime: number = 0;
  private cleanupTimeout: number | null = null;
  private languageChangeHandler: (() => void) | null = null;
  private mountedRef: { current: boolean } = { current: true };

  private constructor() {
    this.initializeLanguageListener();
  }

  static getInstance(): PayPalService {
    if (!PayPalService.instance) {
      PayPalService.instance = new PayPalService();
    }
    return PayPalService.instance;
  }

  private initializeLanguageListener(): void {
    try {
      this.languageChangeHandler = () => {
        if (this.paypalPromise) {
          this.cleanup();
          this.initialize().catch(console.error);
        }
      };
      window.addEventListener('languagechange', this.languageChangeHandler);
    } catch (error) {
      console.warn('Failed to initialize language listener:', error);
    }
  }

  private getConfig(): PayPalConfig {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID?.trim();
    if (!clientId) {
      throw new Error('PayPal client ID is not configured');
    }

    // Get language from document with fallback
    let locale = 'en_US';
    try {
      const docLang = document.documentElement?.lang || navigator.language;
      locale = docLang.toLowerCase().startsWith('de') ? 'de_DE' : 'en_US';
    } catch (error) {
      console.warn('Failed to detect language:', error);
    }

    return {
      "client-id": clientId,
      currency: "EUR",
      intent: "capture",
      components: "buttons",
      "enable-funding": "card",
      "disable-funding": "credit,paylater",
      locale
    };
  }

  private async waitForPayPalSDK(timeoutMs: number = 5000): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      if (window.paypal) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    throw new Error('PayPal SDK not loaded after waiting');
  }

  private scheduleCleanup(): void {
    if (this.cleanupTimeout) {
      window.clearTimeout(this.cleanupTimeout);
    }
    
    this.cleanupTimeout = window.setTimeout(() => {
      this.cleanup();
    }, CLEANUP_TIMEOUT);
  }

  async initialize(retryAttempt = 0): Promise<any> {
    try {
      if (this.paypalPromise) {
        return this.paypalPromise;
      }

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
          this.scheduleCleanup();
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
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryAttempt)));
        return this.initialize(retryAttempt + 1);
      }

      throw error;
    }
  }

  async createOrder(amount: number, userId: string): Promise<any> {
    if (!userId) {
      throw new Error('User ID is required for creating an order');
    }

    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount');
    }

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
        createOrder: async (data: any, actions: any) => {
          if (!actions?.order?.create) {
            throw new Error('PayPal order creation not available');
          }

          try {
            return await actions.order.create({
              purchase_units: [{
                amount: {
                  value: amount.toFixed(2),
                  currency_code: "EUR"
                },
                description: "Vehicle Tax Exemption Check",
                custom_id: userId,
                soft_descriptor: "UNITAIN"
              }],
              application_context: {
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
                brand_name: "UNITAIN",
                locale: document.documentElement?.lang === 'de' ? 'de_DE' : 'en_US'
              }
            });
          } catch (error) {
            console.error('Failed to create PayPal order:', error);
            toast.error('Failed to create payment. Please try again.');
            throw error;
          }
        },
        onApprove: async (data: any, actions: any) => {
          try {
            if (!actions?.order?.capture) {
              throw new Error('PayPal capture action not available');
            }

            const order = await actions.order.capture();
            if (order.status === 'COMPLETED') {
              toast.success('Payment successful! You can now proceed with your application.');
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
          this.cleanup();
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
      if (this.cleanupTimeout) {
        window.clearTimeout(this.cleanupTimeout);
        this.cleanupTimeout = null;
      }

      if (this.languageChangeHandler) {
        window.removeEventListener('languagechange', this.languageChangeHandler);
      }

      const scripts = document.querySelectorAll('script[src*="paypal"]');
      scripts.forEach(script => script.remove());

      const iframes = document.querySelectorAll('iframe[name*="paypal"]');
      iframes.forEach(iframe => iframe.remove());

      Object.keys(localStorage).forEach(key => {
        if (key.toLowerCase().includes('paypal')) {
          localStorage.removeItem(key);
        }
      });

      this.paypalPromise = null;
      this.retryCount = 0;
      this.loadStartTime = 0;

      if (window.paypal) {
        delete window.paypal;
      }
    } catch (error) {
      console.error('Error during PayPal cleanup:', error);
    }
  }
}

export const paypalService = PayPalService.getInstance();