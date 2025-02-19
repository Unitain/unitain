declare global {
  interface Window {
    paypal?: {
      Buttons: (config: any) => {
        render: (selector: string) => Promise<void>;
        isEligible: () => boolean;
      };
      FUNDING: {
        PAYPAL: string;
      };
    };
  }
}

export {};