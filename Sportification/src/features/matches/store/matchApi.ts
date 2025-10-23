import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@core/config';
import { Match, CreateMatchRequest, UpdateScoreRequest, MatchFilters } from '@features/matches/types';
import { ApiResponse } from '../../types/api';
import { apiService } from '@shared/services/api';
import { unwrapApiResponse, unwrapNestedData } from '../../utils/apiHelpers';

export const matchApi = createApi({
  reducerPath: 'matchApi',
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
  tagTypes: ['Match', 'Matches'],
  endpoints: (builder) => ({
    getMatches: builder.query<Match[], MatchFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return `/matches?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse<Match[]>) => unwrapApiResponse(response),
      providesTags: ['Matches'],
    }),
    getMatch: builder.query<Match, string>({
      query: (id) => `/matches/${id}`,
      transformResponse: (response: ApiResponse<{ match: Match }>) => unwrapNestedData(response, 'match'),
      providesTags: (result, error, id) => [{ type: 'Match', id }],
    }),
    createMatch: builder.mutation<Match, CreateMatchRequest>({
      query: (matchData) => ({
        url: '/matches',
        method: 'POST',
        body: matchData,
      }),
      transformResponse: (response: ApiResponse<{ match: Match }>) => unwrapNestedData(response, 'match'),
      invalidatesTags: ['Matches'],
    }),
    updateMatch: builder.mutation<Match, { id: string; data: Partial<CreateMatchRequest> }>({
      query: ({ id, data }) => ({
        url: `/matches/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: ApiResponse<{ match: Match }>) => unwrapNestedData(response, 'match'),
      invalidatesTags: (result, error, { id }) => [{ type: 'Match', id }, 'Matches'],
    }),
    joinMatch: builder.mutation<Match, string>({
      query: (id) => ({
        url: `/matches/${id}/join`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ match: Match }>) => unwrapNestedData(response, 'match'),
      invalidatesTags: (result, error, id) => [{ type: 'Match', id }, 'Matches'],
    }),
    leaveMatch: builder.mutation<void, string>({
      query: (id) => ({
        url: `/matches/${id}/leave`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
      invalidatesTags: (result, error, id) => [{ type: 'Match', id }, 'Matches'],
    }),
    updateScore: builder.mutation<Match, { id: string; score: UpdateScoreRequest }>({
      query: ({ id, score }) => ({
        url: `/matches/${id}/score`,
        method: 'PATCH',
        body: score,
      }),
      transformResponse: (response: ApiResponse<{ match: Match }>) => unwrapNestedData(response, 'match'),
      invalidatesTags: (result, error, { id }) => [{ type: 'Match', id }, 'Matches'],
    }),
    updateStatus: builder.mutation<Match, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/matches/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (response: ApiResponse<{ match: Match }>) => unwrapNestedData(response, 'match'),
      invalidatesTags: (result, error, { id }) => [{ type: 'Match', id }, 'Matches'],
    }),
    deleteMatch: builder.mutation<void, string>({
      query: (id) => ({
        url: `/matches/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
      invalidatesTags: ['Matches'],
    }),
  }),
});

export const {
  useGetMatchesQuery,
  useLazyGetMatchesQuery,
  useGetMatchQuery,
  useCreateMatchMutation,
  useUpdateMatchMutation,
  useJoinMatchMutation,
  useLeaveMatchMutation,
  useUpdateScoreMutation,
  useUpdateStatusMutation,
  useDeleteMatchMutation,
} = matchApi;
