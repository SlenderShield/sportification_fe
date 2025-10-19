import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';
import { Match, CreateMatchRequest, UpdateScoreRequest, MatchFilters } from '../../types/match';
import { ApiResponse, PaginatedResponse } from '../../types/api';
import { apiService } from '../../services/api';

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
    getMatches: builder.query<ApiResponse<PaginatedResponse<Match>>, MatchFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return `/matches?${params.toString()}`;
      },
      providesTags: ['Matches'],
    }),
    getMatch: builder.query<ApiResponse<Match>, string>({
      query: (id) => `/matches/${id}`,
      providesTags: (result, error, id) => [{ type: 'Match', id }],
    }),
    createMatch: builder.mutation<ApiResponse<Match>, CreateMatchRequest>({
      query: (matchData) => ({
        url: '/matches',
        method: 'POST',
        body: matchData,
      }),
      invalidatesTags: ['Matches'],
    }),
    updateMatch: builder.mutation<ApiResponse<Match>, { id: string; data: Partial<CreateMatchRequest> }>({
      query: ({ id, data }) => ({
        url: `/matches/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Match', id }, 'Matches'],
    }),
    joinMatch: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/matches/${id}/join`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Match', id }, 'Matches'],
    }),
    leaveMatch: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/matches/${id}/leave`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Match', id }, 'Matches'],
    }),
    updateScore: builder.mutation<ApiResponse<Match>, { id: string; score: UpdateScoreRequest }>({
      query: ({ id, score }) => ({
        url: `/matches/${id}/score`,
        method: 'PUT',
        body: score,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Match', id }, 'Matches'],
    }),
    updateStatus: builder.mutation<ApiResponse<Match>, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/matches/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Match', id }, 'Matches'],
    }),
    deleteMatch: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/matches/${id}`,
        method: 'DELETE',
      }),
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
