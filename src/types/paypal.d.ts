declare global {
  interface Window {
    paypal?: {
      Buttons: (config: any) => {
        render: (selector: string | HTMLElement) => Promise<void>;
        isEligible: () => boolean;
      };
      FUNDING: {
        PAYPAL: string;
      };
      createOrder: (orderData: any) => Promise<string>;
      captureOrder: (orderId: string) => Promise<any>;
    };
  }
}

export {};