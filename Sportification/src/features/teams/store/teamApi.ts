import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@core/config';
import { Team, CreateTeamRequest, UpdateTeamRequest } from '@features/teams/types';
import { ApiResponse } from '../../types/api';
import { apiService } from '@shared/services/api';
import { unwrapApiResponse, unwrapNestedData } from '../../utils/apiHelpers';

export const teamApi = createApi({
  reducerPath: 'teamApi',
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
  tagTypes: ['Team', 'Teams', 'MyTeams'],
  endpoints: (builder) => ({
    getTeams: builder.query<Team[], { page?: number; limit?: number; sport?: string; search?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        if (params.sport) queryParams.append('sport', params.sport);
        if (params.search) queryParams.append('search', params.search);
        return `/teams?${queryParams.toString()}`;
      },
      transformResponse: (response: ApiResponse<Team[]>) => unwrapApiResponse(response),
      providesTags: ['Teams'],
    }),
    getMyTeams: builder.query<Team[], void>({
      query: () => '/teams/my/teams',
      transformResponse: (response: ApiResponse<{ teams: Team[] }>) => unwrapNestedData(response, 'teams'),
      providesTags: ['MyTeams'],
    }),
    getTeam: builder.query<Team, string>({
      query: (id) => `/teams/${id}`,
      transformResponse: (response: ApiResponse<{ team: Team }>) => unwrapNestedData(response, 'team'),
      providesTags: (result, error, id) => [{ type: 'Team', id }],
    }),
    createTeam: builder.mutation<Team, CreateTeamRequest>({
      query: (teamData) => ({
        url: '/teams',
        method: 'POST',
        body: teamData,
      }),
      transformResponse: (response: ApiResponse<{ team: Team }>) => unwrapNestedData(response, 'team'),
      invalidatesTags: ['Teams', 'MyTeams'],
    }),
    updateTeam: builder.mutation<Team, { id: string; data: UpdateTeamRequest }>({
      query: ({ id, data }) => ({
        url: `/teams/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: ApiResponse<{ team: Team }>) => unwrapNestedData(response, 'team'),
      invalidatesTags: (result, error, { id }) => [{ type: 'Team', id }, 'Teams', 'MyTeams'],
    }),
    joinTeam: builder.mutation<Team, string>({
      query: (id) => ({
        url: `/teams/${id}/join`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ team: Team }>) => unwrapNestedData(response, 'team'),
      invalidatesTags: (result, error, id) => [{ type: 'Team', id }, 'Teams', 'MyTeams'],
    }),
    leaveTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `/teams/${id}/leave`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
      invalidatesTags: (result, error, id) => [{ type: 'Team', id }, 'Teams', 'MyTeams'],
    }),
    removeMember: builder.mutation<void, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/members/${userId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
      invalidatesTags: (result, error, { teamId }) => [{ type: 'Team', id: teamId }, 'MyTeams'],
    }),
    deleteTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<void>) => unwrapApiResponse(response),
      invalidatesTags: ['Teams', 'MyTeams'],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useGetMyTeamsQuery,
  useGetTeamQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useJoinTeamMutation,
  useLeaveTeamMutation,
  useRemoveMemberMutation,
  useDeleteTeamMutation,
} = teamApi;
