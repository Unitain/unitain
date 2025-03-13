import { loadScript } from "@paypal/paypal-js";
import toast from 'react-hot-toast';
import i18next from 'i18next';

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
  private isInitializing: boolean = false;

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

  private validateClientId(clientId: string | undefined): string {
    if (!clientId) {
      throw new Error('PayPal client ID is missing. Please check your environment variables.');
    }

    const trimmedId = clientId.trim();
    if (!trimmedId) {
      throw new Error('PayPal client ID is empty. Please check your environment variables.');
    }

    // Basic format validation for PayPal client ID
    if (!/^[A-Za-z0-9_-]{20,}$/.test(trimmedId)) {
      throw new Error('Invalid PayPal client ID format. Please check your environment variables.');
    }

    return trimmedId;
  }

  private getConfig(): PayPalConfig {
    try {
      // Use the correct client ID
      const clientId = "AZIyqfEJN1lnumZt41tTtIMBgv8U0VHYUyMq-IIgoJNnzX7E83-5w6TT4RG_9TTaI0RGZzfRcL7it5QZ";

      // Get language from i18next with fallback
      let locale = 'en_US';
      try {
        const lang = i18next.language || document.documentElement?.lang || navigator.language;
        locale = lang.toLowerCase().startsWith('de') ? 'de_DE' : 'en_US';
      } catch (error) {
        console.warn('Failed to detect language:', error);
      }

      const config = {
        "client-id": clientId,
        currency: "EUR",
        intent: "capture" as const,
        components: "buttons",
        "enable-funding": "card",
        "disable-funding": "credit,paylater",
        locale
      };

      console.log('PayPal Configuration:', {
        ...config,
        "client-id": "[REDACTED]",
        timestamp: new Date().toISOString()
      });

      return config;
    } catch (error) {
      console.error('Failed to get PayPal configuration:', error);
      throw error;
    }
  }

  private async waitForPayPalSDK(timeoutMs: number = 5000): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      if (window.paypal?.Buttons) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    throw new Error('PayPal SDK initialization timeout');
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
    if (this.isInitializing) {
      console.log('PayPal initialization already in progress...');
      return this.paypalPromise;
    }

    try {
      console.log(`Initializing PayPal (attempt ${retryAttempt + 1}/${MAX_RETRIES + 1})`);
      this.isInitializing = true;

      // Check if PayPal is already initialized
      if (window.paypal?.Buttons) {
        console.log('PayPal SDK already loaded');
        return window.paypal;
      }

      // Clean up any existing PayPal elements before initializing
      this.cleanup();

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

      const paypal = await this.paypalPromise;
      if (!paypal?.Buttons) {
        throw new Error('PayPal SDK not properly initialized');
      }

      console.log('PayPal SDK initialized successfully');
      return paypal;
    } catch (error) {
      const errorDetails = {
        message: error instanceof Error ? error.message : 'Unknown error',
        retryAttempt,
        timestamp: new Date().toISOString(),
        loadTime: Date.now() - this.loadStartTime
      };
      console.error('PayPal initialization error:', errorDetails);
      this.cleanup();

      if (retryAttempt < MAX_RETRIES) {
        console.log(`Retrying PayPal initialization in ${RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryAttempt)));
        return this.initialize(retryAttempt + 1);
      }

      throw error;
    } finally {
      this.isInitializing = false;
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
      console.log('Creating PayPal order:', { amount, userId });
      const paypal = await this.initialize();
      
      if (!paypal?.Buttons) {
        throw new Error('PayPal SDK not properly initialized');
      }

      const buttons = paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'primary',
          shape: 'rect',
          label: 'pay'
        },
        createOrder: async (data: any, actions: any) => {
          if (!actions?.order?.create) {
            throw new Error('PayPal order creation not available');
          }

          try {
            console.log('Creating PayPal order with data:', {
              amount: amount.toFixed(2),
              userId
            });

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
                locale: i18next.language === 'de' ? 'de_DE' : 'en_US'
              }
            });
          } catch (error) {
            console.error('Failed to create PayPal order:', {
              error: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date().toISOString()
            });
            toast.error('Failed to create payment. Please try again.');
            throw error;
          }
        },
        onApprove: async (data: any, actions: any) => {
          try {
            if (!actions?.order?.capture) {
              throw new Error('PayPal capture action not available');
            }

            console.log('Capturing PayPal order:', data.orderID);
            const order = await actions.order.capture();
            
            if (order.status === 'COMPLETED') {
              console.log('Payment completed successfully:', {
                orderId: order.id,
                status: order.status
              });
              toast.success('Payment successful! You can now proceed with your application.');
              return order;
            } else {
              throw new Error(`Payment status: ${order.status}`);
            }
          } catch (error) {
            console.error('Payment capture failed:', {
              error: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date().toISOString()
            });
            toast.error('We could not process your payment. Please try again.');
            throw error;
          }
        },
        onCancel: () => {
          console.log('Payment cancelled by user');
          toast.error('Payment was cancelled. Please try again when you\'re ready.');
        },
        onError: (err: any) => {
          console.error('PayPal button error:', {
            error: err instanceof Error ? err.message : 'Unknown error',
            timestamp: new Date().toISOString()
          });
          toast.error('The payment system encountered an error. Please try again later.');
          this.cleanup();
          throw err;
        }
      });

      // Verify button eligibility
      if (!buttons.isEligible()) {
        throw new Error('PayPal buttons not eligible for this configuration');
      }

      return buttons;
    } catch (error) {
      console.error('Error creating PayPal order:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
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

      // Clean up PayPal scripts and iframes
      const scripts = document.querySelectorAll('script[src*="paypal"]');
      scripts.forEach(script => script.remove());

      const iframes = document.querySelectorAll('iframe[name*="paypal"]');
      iframes.forEach(iframe => iframe.remove());

      // Clean up localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.toLowerCase().includes('paypal')) {
          localStorage.removeItem(key);
        }
      });

      this.paypalPromise = null;
      this.retryCount = 0;
      this.loadStartTime = 0;
      this.isInitializing = false;

      if (window.paypal) {
        delete window.paypal;
      }

      console.log('PayPal cleanup completed');
    } catch (error) {
      console.error('Error during PayPal cleanup:', error);
    }
  }
}

export const paypalService = PayPalService.getInstance();