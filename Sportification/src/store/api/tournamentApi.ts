import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@core/config';
import { Tournament, CreateTournamentRequest, TournamentBracket } from '../../types/tournament';
import { ApiResponse } from '../../types/api';
import { apiService } from '../../services/api';
import { unwrapApiResponse, unwrapNestedData } from '../../utils/apiHelpers';

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
    getTournaments: builder.query<Tournament[], { page?: number; limit?: number; sport?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        if (params.sport) queryParams.append('sport', params.sport);
        return `/tournaments?${queryParams.toString()}`;
      },
      transformResponse: (response: ApiResponse<Tournament[]>) => unwrapApiResponse(response),
      providesTags: ['Tournaments'],
    }),
    getTournament: builder.query<Tournament, string>({
      query: (id) => `/tournaments/${id}`,
      transformResponse: (response: ApiResponse<{ tournament: Tournament }>) => unwrapNestedData(response, 'tournament'),
      providesTags: (result, error, id) => [{ type: 'Tournament', id }],
    }),
    createTournament: builder.mutation<Tournament, CreateTournamentRequest>({
      query: (tournamentData) => ({
        url: '/tournaments',
        method: 'POST',
        body: tournamentData,
      }),
      transformResponse: (response: ApiResponse<{ tournament: Tournament }>) => unwrapNestedData(response, 'tournament'),
      invalidatesTags: ['Tournaments'],
    }),
    updateTournament: builder.mutation<Tournament, { id: string; data: Partial<CreateTournamentRequest> }>({
      query: ({ id, data }) => ({
        url: `/tournaments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: ApiResponse<{ tournament: Tournament }>) => unwrapNestedData(response, 'tournament'),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tournament', id }, 'Tournaments'],
    }),
    joinTournament: builder.mutation<Tournament, string>({
      query: (id) => ({
        url: `/tournaments/${id}/join`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ tournament: Tournament }>) => unwrapNestedData(response, 'tournament'),
      invalidatesTags: (result, error, id) => [{ type: 'Tournament', id }, 'Tournaments'],
    }),
    leaveTournament: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tournaments/${id}/leave`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
      invalidatesTags: (result, error, id) => [{ type: 'Tournament', id }, 'Tournaments'],
    }),
    startTournament: builder.mutation<Tournament, string>({
      query: (id) => ({
        url: `/tournaments/${id}/start`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ tournament: Tournament }>) => unwrapNestedData(response, 'tournament'),
      invalidatesTags: (result, error, id) => [{ type: 'Tournament', id }, 'Bracket'],
    }),
    getBracket: builder.query<TournamentBracket, string>({
      query: (id) => `/tournaments/${id}/bracket`,
      transformResponse: (response: ApiResponse<{ bracket: TournamentBracket }>) => unwrapNestedData(response, 'bracket'),
      providesTags: (result, error, id) => [{ type: 'Bracket', id }],
    }),
    getStandings: builder.query<any, string>({
      query: (id) => `/tournaments/${id}/standings`,
      transformResponse: (response: ApiResponse<any>) => unwrapApiResponse(response),
      providesTags: ['Standings'],
    }),
    deleteTournament: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tournaments/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
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
