import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';
import { Notification } from '../../types/notification';
import { ApiResponse } from '../../types/api';
import { apiService } from '../../services/api';
import { unwrapApiResponse } from '../../utils/apiHelpers';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
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
  tagTypes: ['Notification', 'Notifications'],
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], { page?: number; limit?: number; read?: boolean; type?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        if (params.read !== undefined) queryParams.append('read', String(params.read));
        if (params.type) queryParams.append('type', params.type);
        return `/notifications?${queryParams.toString()}`;
      },
      transformResponse: (response: ApiResponse<Notification[]>) => unwrapApiResponse(response),
      providesTags: ['Notifications'],
    }),
    markAsRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
      invalidatesTags: ['Notifications'],
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;
