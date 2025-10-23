import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@core/config';
import { ApiResponse } from '../../types/api';
import { apiService } from '../../services/api';
import { unwrapApiResponse } from '../../utils/apiHelpers';
import {
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  PaymentHistory,
  RefundRequest,
} from '../../types/payment';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`,
    prepareHeaders: async (headers) => {
      const token = await apiService.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Payments'],
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<CreatePaymentIntentResponse, CreatePaymentIntentRequest>({
      query: (data) => ({
        url: '/payments/create-intent',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<CreatePaymentIntentResponse>) =>
        unwrapApiResponse(response),
    }),
    getPaymentHistory: builder.query<PaymentHistory[], void>({
      query: () => '/payments/history',
      transformResponse: (response: ApiResponse<PaymentHistory[]>) =>
        unwrapApiResponse(response),
      providesTags: ['Payments'],
    }),
    requestRefund: builder.mutation<void, RefundRequest>({
      query: (data) => ({
        url: '/payments/refund',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payments'],
    }),
    confirmPayment: builder.mutation<void, { paymentIntentId: string; bookingId?: string }>({
      query: (data) => ({
        url: '/payments/confirm',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payments'],
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useGetPaymentHistoryQuery,
  useRequestRefundMutation,
  useConfirmPaymentMutation,
} = paymentApi;
