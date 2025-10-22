import { paymentService } from '../../src/services/paymentService';
import { initStripe } from '@stripe/stripe-react-native';

jest.mock('@stripe/stripe-react-native', () => ({
  initStripe: jest.fn(),
  useStripe: jest.fn(),
  useConfirmPayment: jest.fn(),
  StripeProvider: 'StripeProvider',
}));

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the initialized state
    (paymentService as any).initialized = false;
  });

  describe('initialize', () => {
    it('should initialize Stripe with publishable key', async () => {
      const publishableKey = 'pk_test_123456';
      (initStripe as jest.Mock).mockResolvedValue(undefined);

      await paymentService.initialize(publishableKey);

      expect(initStripe).toHaveBeenCalledWith({
        publishableKey,
        merchantIdentifier: undefined,
        urlScheme: 'sportification',
      });
      expect(paymentService.isInitialized()).toBe(true);
    });

    it('should initialize Stripe with merchant identifier', async () => {
      const publishableKey = 'pk_test_123456';
      const merchantId = 'merchant.sportification';
      (initStripe as jest.Mock).mockResolvedValue(undefined);

      await paymentService.initialize(publishableKey, merchantId);

      expect(initStripe).toHaveBeenCalledWith({
        publishableKey,
        merchantIdentifier: merchantId,
        urlScheme: 'sportification',
      });
    });

    it('should not initialize twice', async () => {
      const publishableKey = 'pk_test_123456';
      (initStripe as jest.Mock).mockResolvedValue(undefined);

      await paymentService.initialize(publishableKey);
      await paymentService.initialize(publishableKey);

      expect(initStripe).toHaveBeenCalledTimes(1);
    });

    it('should handle initialization error', async () => {
      const publishableKey = 'pk_test_invalid';
      const error = new Error('Invalid key');
      (initStripe as jest.Mock).mockRejectedValue(error);

      await expect(paymentService.initialize(publishableKey)).rejects.toThrow('Invalid key');
      expect(paymentService.isInitialized()).toBe(false);
    });
  });

  describe('isInitialized', () => {
    it('should return false initially', () => {
      expect(paymentService.isInitialized()).toBe(false);
    });

    it('should return true after initialization', async () => {
      (initStripe as jest.Mock).mockResolvedValue(undefined);
      await paymentService.initialize('pk_test_123456');

      expect(paymentService.isInitialized()).toBe(true);
    });
  });
});
