import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@core/config';
import { ApiResponse } from '../../types/api';
import { apiService } from '../../services/api';
import { unwrapApiResponse } from '../../utils/apiHelpers';
import { Match } from '@features/matches/types';
import { Venue } from '@features/venues/types';
import { User } from '@features/auth/types';

export interface RecommendationsResponse {
  matches?: Match[];
  venues?: Venue[];
  players?: User[];
}

export const recommendationApi = createApi({
  reducerPath: 'recommendationApi',
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
  tagTypes: ['Recommendations'],
  endpoints: (builder) => ({
    getRecommendedMatches: builder.query<Match[], { limit?: number; sport?: string }>({
      query: (params) => ({
        url: '/recommendations/matches',
        params,
      }),
      transformResponse: (response: ApiResponse<Match[]>) => unwrapApiResponse(response),
      providesTags: ['Recommendations'],
    }),
    getRecommendedVenues: builder.query<Venue[], { limit?: number; sport?: string; location?: { latitude: number; longitude: number } }>({
      query: (params) => ({
        url: '/recommendations/venues',
        params,
      }),
      transformResponse: (response: ApiResponse<Venue[]>) => unwrapApiResponse(response),
      providesTags: ['Recommendations'],
    }),
    getRecommendedPlayers: builder.query<User[], { limit?: number }>({
      query: (params) => ({
        url: '/recommendations/players',
        params,
      }),
      transformResponse: (response: ApiResponse<User[]>) => unwrapApiResponse(response),
      providesTags: ['Recommendations'],
    }),
    getNearbyMatches: builder.query<Match[], { latitude: number; longitude: number; radius?: number; sport?: string }>({
      query: (params) => ({
        url: '/matches/nearby',
        params,
      }),
      transformResponse: (response: ApiResponse<Match[]>) => unwrapApiResponse(response),
    }),
    getNearbyVenues: builder.query<Venue[], { latitude: number; longitude: number; radius?: number; sport?: string }>({
      query: (params) => ({
        url: '/venues/nearby',
        params,
      }),
      transformResponse: (response: ApiResponse<Venue[]>) => unwrapApiResponse(response),
    }),
  }),
});

export const {
  useGetRecommendedMatchesQuery,
  useGetRecommendedVenuesQuery,
  useGetRecommendedPlayersQuery,
  useGetNearbyMatchesQuery,
  useGetNearbyVenuesQuery,
} = recommendationApi;
