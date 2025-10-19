import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';
import { Notification } from '../../types/notification';
import { ApiResponse, PaginatedResponse } from '../../types/api';
import { apiService } from '../../services/api';

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
    getNotifications: builder.query<ApiResponse<PaginatedResponse<Notification> & { unreadCount: number }>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => `/notifications?page=${page}&limit=${limit}`,
      providesTags: ['Notifications'],
    }),
    markAsRead: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),
    markAllAsRead: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;
