export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  clientSecret: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet';
  card?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
  billingDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  bookingId?: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentHistory {
  _id: string;
  user: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  paymentMethod: string;
  booking?: {
    _id: string;
    venue: {
      name: string;
    };
  };
  stripePaymentIntentId: string;
  refundReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RefundRequest {
  paymentId: string;
  amount?: number;
  reason?: string;
}
