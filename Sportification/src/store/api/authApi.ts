import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User, 
  UserStats,
  Achievement,
} from '../../types/auth';
import { ApiResponse } from '../../types/api';
import { apiService } from '../../services/api';

export const authApi = createApi({
  reducerPath: 'authApi',
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
  tagTypes: ['User', 'Profile', 'Stats', 'Friends'],
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            const { accessToken, refreshToken } = data.data.tokens;
            await apiService.saveTokens(accessToken, refreshToken);
          }
        } catch (error) {
          console.error('Login error:', error);
        }
      },
    }),
    register: builder.mutation<ApiResponse<LoginResponse>, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            const { accessToken, refreshToken } = data.data.tokens;
            await apiService.saveTokens(accessToken, refreshToken);
          }
        } catch (error) {
          console.error('Register error:', error);
        }
      },
    }),
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation<ApiResponse<void>, { currentPassword: string; newPassword: string }>({
      query: (passwords) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: passwords,
      }),
    }),
    getUserStats: builder.query<ApiResponse<UserStats>, string>({
      query: (userId) => `/users/${userId}/stats`,
      providesTags: ['Stats'],
    }),
    getUserAchievements: builder.query<ApiResponse<Achievement[]>, string>({
      query: (userId) => `/users/${userId}/achievements`,
    }),
    searchUsers: builder.query<ApiResponse<User[]>, string>({
      query: (searchTerm) => `/users/search?q=${searchTerm}`,
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
    getFriends: builder.query<ApiResponse<User[]>, void>({
      query: () => '/users/friends',
      providesTags: ['Friends'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetUserStatsQuery,
  useGetUserAchievementsQuery,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useAddFriendMutation,
  useRemoveFriendMutation,
  useGetFriendsQuery,
} = authApi;
