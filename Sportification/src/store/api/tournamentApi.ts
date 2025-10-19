import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';
import { Tournament, CreateTournamentRequest } from '../../types/tournament';
import { ApiResponse, PaginatedResponse } from '../../types/api';
import { apiService } from '../../services/api';

export const tournamentApi = createApi({
  reducerPath: 'tournamentApi',
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
  tagTypes: ['Tournament', 'Tournaments'],
  endpoints: (builder) => ({
    getTournaments: builder.query<ApiResponse<PaginatedResponse<Tournament>>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/tournaments?page=${page}&limit=${limit}`,
      providesTags: ['Tournaments'],
    }),
    getTournament: builder.query<ApiResponse<Tournament>, string>({
      query: (id) => `/tournaments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tournament', id }],
    }),
    createTournament: builder.mutation<ApiResponse<Tournament>, CreateTournamentRequest>({
      query: (tournamentData) => ({
        url: '/tournaments',
        method: 'POST',
        body: tournamentData,
      }),
      invalidatesTags: ['Tournaments'],
    }),
    updateTournament: builder.mutation<ApiResponse<Tournament>, { id: string; data: Partial<CreateTournamentRequest> }>({
      query: ({ id, data }) => ({
        url: `/tournaments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tournament', id }, 'Tournaments'],
    }),
    joinTournament: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/tournaments/${id}/join`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Tournament', id }, 'Tournaments'],
    }),
    leaveTournament: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/tournaments/${id}/leave`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Tournament', id }, 'Tournaments'],
    }),
    startTournament: builder.mutation<ApiResponse<Tournament>, string>({
      query: (id) => ({
        url: `/tournaments/${id}/start`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Tournament', id }, 'Tournaments'],
    }),
    deleteTournament: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/tournaments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tournaments'],
    }),
  }),
});

export const {
  useGetTournamentsQuery,
  useGetTournamentQuery,
  useCreateTournamentMutation,
  useUpdateTournamentMutation,
  useJoinTournamentMutation,
  useLeaveTournamentMutation,
  useStartTournamentMutation,
  useDeleteTournamentMutation,
} = tournamentApi;
