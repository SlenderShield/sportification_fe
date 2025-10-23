import { IService, ValidationError, logger } from '@core';
import { ProfileRepository } from '../repositories/ProfileRepository';

export interface IProfileService extends IService {
  getPaymentMethods(): Promise<any[]>;
  addPaymentMethod(data: any): Promise<any>;
  removePaymentMethod(id: string): Promise<void>;
  processPayment(amount: number, method: string): Promise<any>;
  getTransactionHistory(): Promise<any[]>;
}

export class ProfileService implements IProfileService {
  constructor(private repository: ProfileRepository) {}

  async initialize(): Promise<void> {
    logger.info('ProfileService initialized');
  }

  cleanup(): void {
    logger.info('ProfileService cleanup');
  }

  async getPaymentMethods(): Promise<any[]> {
    try {
      return await this.repository.getPaymentMethods();
    } catch (error) {
      logger.error('Failed to get payment methods', error as Error);
      throw error;
    }
  }

  async addPaymentMethod(data: any): Promise<any> {
    try {
      if (!data.cardNumber || !data.expiryDate || !data.cvv) {
        throw new ValidationError('Invalid payment method data');
      }

      const method = await this.repository.addPaymentMethod(data);
      logger.info('Payment method added');
      return method;
    } catch (error) {
      logger.error('Failed to add payment method', error as Error);
      throw error;
    }
  }

  async removePaymentMethod(id: string): Promise<void> {
    try {
      await this.repository.removePaymentMethod(id);
      logger.info('Payment method removed', { id });
    } catch (error) {
      logger.error('Failed to remove payment method', error as Error, { id });
      throw error;
    }
  }

  async processPayment(amount: number, method: string): Promise<any> {
    try {
      if (amount <= 0) {
        throw new ValidationError('Payment amount must be greater than 0');
      }

      if (!method) {
        throw new ValidationError('Payment method is required');
      }

      const payment = await this.repository.processPayment({ amount, method });
      logger.info('Payment processed', { amount, method });
      return payment;
    } catch (error) {
      logger.error('Payment processing failed', error as Error, { amount, method });
      throw error;
    }
  }

  async getTransactionHistory(): Promise<any[]> {
    try {
      return await this.repository.getTransactionHistory();
    } catch (error) {
      logger.error('Failed to get transaction history', error as Error);
      throw error;
    }
  }
}

export const profileService = new ProfileService(new ProfileRepository());
