import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';
import { User } from '../../types/auth';
import { ApiResponse, PaginatedResponse } from '../../types/api';
import { apiService } from '../../services/api';

export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['Friends', 'Users', 'Profile'],
  endpoints: (builder) => ({
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),
    getFriends: builder.query<ApiResponse<{ friends: User[] }>, string>({
      query: (userId) => `/users/${userId}/friends`,
      providesTags: ['Friends'],
    }),
    searchUsers: builder.query<ApiResponse<PaginatedResponse<User>>, { query: string }>({
      query: ({ query }) => `/users/search?query=${encodeURIComponent(query)}`,
      providesTags: ['Users'],
    }),
    addFriend: builder.mutation<ApiResponse<void>, string>({
      query: (userId) => ({
        url: `/users/${userId}/friend`,
        method: 'POST',
      }),
      invalidatesTags: ['Friends'],
    }),
    removeFriend: builder.mutation<ApiResponse<void>, string>({
      query: (userId) => ({
        url: `/users/${userId}/friend`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Friends'],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useGetFriendsQuery,
  useSearchUsersQuery,
  useAddFriendMutation,
  useRemoveFriendMutation,
} = userApi;
