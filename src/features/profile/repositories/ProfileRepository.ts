import { paymentApi } from '../store';

export class ProfileRepository {
  async getPaymentMethods(): Promise<any[]> {
    const result = await paymentApi.endpoints.getPaymentMethods.initiate();
    const data = result.data as any;
    return data?.data?.items || [];
  }

  async addPaymentMethod(data: any): Promise<any> {
    const result = await paymentApi.endpoints.addPaymentMethod.initiate(data);
    return result.data;
  }

  async removePaymentMethod(id: string): Promise<void> {
    await paymentApi.endpoints.removePaymentMethod.initiate(id);
  }

  async processPayment(data: any): Promise<any> {
    const result = await paymentApi.endpoints.processPayment.initiate(data);
    return result.data;
  }

  async getTransactionHistory(): Promise<any[]> {
    const result = await paymentApi.endpoints.getTransactions.initiate();
    const data = result.data as any;
    return data?.data?.items || [];
  }
}

export const profileRepository = new ProfileRepository();
