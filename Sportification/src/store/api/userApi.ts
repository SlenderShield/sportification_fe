import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@core/config';
import { User } from '../../types/auth';
import { ApiResponse } from '../../types/api';
import { apiService } from '../../services/api';
import { unwrapApiResponse, unwrapNestedData } from '../../utils/apiHelpers';

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
  tagTypes: ['Friends', 'Users', 'User', 'Profile'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], { page?: number; limit?: number; search?: string; sport?: string; skillLevel?: string; location?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        if (params.search) queryParams.append('search', params.search);
        if (params.sport) queryParams.append('sport', params.sport);
        if (params.skillLevel) queryParams.append('skillLevel', params.skillLevel);
        if (params.location) queryParams.append('location', params.location);
        return `/users?${queryParams.toString()}`;
      },
      transformResponse: (response: ApiResponse<User[]>) => unwrapApiResponse(response),
      providesTags: ['Users'],
    }),
    getUser: builder.query<{ user: User; relationship?: { isFriend: boolean; friendshipDate?: string } }, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: ApiResponse<{ user: User; relationship?: { isFriend: boolean; friendshipDate?: string } }>) => unwrapApiResponse(response),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PATCH',
        body: profileData,
      }),
      transformResponse: (response: ApiResponse<{ user: User }>) => unwrapNestedData(response, 'user'),
      invalidatesTags: ['Profile'],
    }),
    getFriends: builder.query<User[], void>({
      query: () => '/users/friends',
      transformResponse: (response: ApiResponse<User[]>) => unwrapApiResponse(response),
      providesTags: ['Friends'],
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
      providesTags: ['Users'],
    }),
    addFriend: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}/friend`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
      invalidatesTags: ['Friends', 'Users'],
    }),
    removeFriend: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}/friend`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
      invalidatesTags: ['Friends', 'Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateProfileMutation,
  useGetFriendsQuery,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useAddFriendMutation,
  useRemoveFriendMutation,
} = userApi;
