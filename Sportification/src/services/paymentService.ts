import { initStripe, useStripe, StripeProvider } from '@stripe/stripe-react-native';

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

class PaymentService {
  private initialized = false;

  /**
   * Initialize Stripe with publishable key
   */
  async initialize(publishableKey: string, merchantIdentifier?: string): Promise<void> {
    if (this.initialized) return;

    try {
      await initStripe({
        publishableKey,
        merchantIdentifier, // Required for Apple Pay
        urlScheme: 'sportification', // For payment redirects
      });
      this.initialized = true;
    } catch (error) {
      console.error('Stripe initialization error:', error);
      throw error;
    }
  }

  /**
   * Check if Stripe is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

export const paymentService = new PaymentService();

/**
 * Hook for payment operations
 * Must be used within StripeProvider
 */
export const usePayment = () => {
  const { confirmPayment, handleCardAction } = useStripe();

  const processPayment = async (
    clientSecret: string,
    billingDetails?: {
      email?: string;
      name?: string;
    }
  ): Promise<PaymentResult> => {
    try {
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails,
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        paymentIntentId: paymentIntent?.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  };

  const handlePaymentAction = async (clientSecret: string): Promise<PaymentResult> => {
    try {
      const { error, paymentIntent } = await handleCardAction(clientSecret);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        paymentIntentId: paymentIntent?.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment action failed',
      };
    }
  };

  return {
    processPayment,
    handlePaymentAction,
  };
};

export { StripeProvider };
