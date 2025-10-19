import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';
import { Tournament, CreateTournamentRequest, TournamentBracket } from '../../types/tournament';
import { ApiResponse } from '../../types/api';
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
  tagTypes: ['Tournament', 'Tournaments', 'Bracket', 'Standings'],
  endpoints: (builder) => ({
    getTournaments: builder.query<ApiResponse<Tournament[]>, { page?: number; limit?: number; sport?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        if (params.sport) queryParams.append('sport', params.sport);
        return `/tournaments?${queryParams.toString()}`;
      },
      providesTags: ['Tournaments'],
    }),
    getTournament: builder.query<ApiResponse<{ tournament: Tournament }>, string>({
      query: (id) => `/tournaments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tournament', id }],
    }),
    createTournament: builder.mutation<ApiResponse<{ tournament: Tournament }>, CreateTournamentRequest>({
      query: (tournamentData) => ({
        url: '/tournaments',
        method: 'POST',
        body: tournamentData,
      }),
      invalidatesTags: ['Tournaments'],
    }),
    updateTournament: builder.mutation<ApiResponse<{ tournament: Tournament }>, { id: string; data: Partial<CreateTournamentRequest> }>({
      query: ({ id, data }) => ({
        url: `/tournaments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tournament', id }, 'Tournaments'],
    }),
    joinTournament: builder.mutation<ApiResponse<{ tournament: Tournament }>, string>({
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
    startTournament: builder.mutation<ApiResponse<{ tournament: Tournament }>, string>({
      query: (id) => ({
        url: `/tournaments/${id}/start`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Tournament', id }, 'Bracket'],
    }),
    getBracket: builder.query<ApiResponse<{ bracket: TournamentBracket }>, string>({
      query: (id) => `/tournaments/${id}/bracket`,
      providesTags: (result, error, id) => [{ type: 'Bracket', id }],
    }),
    getStandings: builder.query<ApiResponse<any>, string>({
      query: (id) => `/tournaments/${id}/standings`,
      providesTags: ['Standings'],
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
  useGetBracketQuery,
  useGetStandingsQuery,
  useDeleteTournamentMutation,
} = tournamentApi;
