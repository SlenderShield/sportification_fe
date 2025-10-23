import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@core/config';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User, 
  UserStats,
  Achievement,
} from '@features/auth/types';
import { ApiResponse } from '../../types/api';
import { apiService } from '@shared/services/api';
import { unwrapApiResponse } from '../../utils/apiHelpers';

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
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ApiResponse<LoginResponse>) => unwrapApiResponse(response),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            const { accessToken, refreshToken } = data;
            await apiService.saveTokens(accessToken, refreshToken);
          }
        } catch (error) {
          console.error('Login error:', error);
        }
      },
    }),
    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: ApiResponse<LoginResponse>) => unwrapApiResponse(response),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            const { accessToken, refreshToken } = data;
            await apiService.saveTokens(accessToken, refreshToken);
          }
        } catch (error) {
          console.error('Register error:', error);
        }
      },
    }),
    getProfile: builder.query<User, void>({
      query: () => '/auth/profile',
      transformResponse: (response: ApiResponse<{ user: User }>) => {
        const data = unwrapApiResponse(response);
        return data.user;
      },
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: profileData,
      }),
      transformResponse: (response: ApiResponse<User>) => unwrapApiResponse(response),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (passwords) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: passwords,
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
    }),
    // Social login endpoints
    loginWithGoogle: builder.mutation<LoginResponse, { idToken: string }>({
      query: (data) => ({
        url: '/auth/google',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<LoginResponse>) => unwrapApiResponse(response),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            const { accessToken, refreshToken } = data;
            await apiService.saveTokens(accessToken, refreshToken);
          }
        } catch (error) {
          console.error('Google login error:', error);
        }
      },
    }),
    loginWithApple: builder.mutation<LoginResponse, { identityToken: string; authorizationCode: string; user: string }>({
      query: (data) => ({
        url: '/auth/apple',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<LoginResponse>) => unwrapApiResponse(response),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            const { accessToken, refreshToken } = data;
            await apiService.saveTokens(accessToken, refreshToken);
          }
        } catch (error) {
          console.error('Apple login error:', error);
        }
      },
    }),
    loginWithFacebook: builder.mutation<LoginResponse, { accessToken: string }>({
      query: (data) => ({
        url: '/auth/facebook',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<LoginResponse>) => unwrapApiResponse(response),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            const { accessToken, refreshToken } = data;
            await apiService.saveTokens(accessToken, refreshToken);
          }
        } catch (error) {
          console.error('Facebook login error:', error);
        }
      },
    }),
    getUserStats: builder.query<UserStats, string>({
      query: (userId) => `/users/${userId}/stats`,
      transformResponse: (response: ApiResponse<UserStats>) => unwrapApiResponse(response),
      providesTags: ['Stats'],
    }),
    getUserAchievements: builder.query<Achievement[], string>({
      query: (userId) => `/users/${userId}/achievements`,
      transformResponse: (response: ApiResponse<Achievement[]>) => unwrapApiResponse(response),
    }),
    searchUsers: builder.query<User[], { search?: string; page?: number; limit?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        return `/users?${queryParams.toString()}`;
      },
      transformResponse: (response: ApiResponse<User[]>) => unwrapApiResponse(response),
    }),
    addFriend: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}/friend`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
      invalidatesTags: ['Friends'],
    }),
    removeFriend: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}/friend`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
      invalidatesTags: ['Friends'],
    }),
    getFriends: builder.query<User[], void>({
      query: () => '/users/friends',
      transformResponse: (response: ApiResponse<User[]>) => unwrapApiResponse(response),
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
  useLoginWithGoogleMutation,
  useLoginWithAppleMutation,
  useLoginWithFacebookMutation,
  useGetUserStatsQuery,
  useGetUserAchievementsQuery,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useAddFriendMutation,
  useRemoveFriendMutation,
  useGetFriendsQuery,
} = authApi;
