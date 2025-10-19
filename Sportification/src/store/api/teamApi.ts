import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';
import { Team, CreateTeamRequest, UpdateTeamRequest } from '../../types/team';
import { ApiResponse, PaginatedResponse } from '../../types/api';
import { apiService } from '../../services/api';

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
    getTeams: builder.query<ApiResponse<Team[]>, { page?: number; limit?: number; sport?: string; search?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        if (params.sport) queryParams.append('sport', params.sport);
        if (params.search) queryParams.append('search', params.search);
        return `/teams?${queryParams.toString()}`;
      },
      providesTags: ['Teams'],
    }),
    getMyTeams: builder.query<ApiResponse<{ teams: Team[] }>, void>({
      query: () => '/teams/my/teams',
      providesTags: ['MyTeams'],
    }),
    getTeam: builder.query<ApiResponse<{ team: Team }>, string>({
      query: (id) => `/teams/${id}`,
      providesTags: (result, error, id) => [{ type: 'Team', id }],
    }),
    createTeam: builder.mutation<ApiResponse<{ team: Team }>, CreateTeamRequest>({
      query: (teamData) => ({
        url: '/teams',
        method: 'POST',
        body: teamData,
      }),
      invalidatesTags: ['Teams', 'MyTeams'],
    }),
    updateTeam: builder.mutation<ApiResponse<{ team: Team }>, { id: string; data: UpdateTeamRequest }>({
      query: ({ id, data }) => ({
        url: `/teams/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Team', id }, 'Teams', 'MyTeams'],
    }),
    joinTeam: builder.mutation<ApiResponse<{ team: Team }>, string>({
      query: (id) => ({
        url: `/teams/${id}/join`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Team', id }, 'Teams', 'MyTeams'],
    }),
    leaveTeam: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/teams/${id}/leave`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Team', id }, 'Teams', 'MyTeams'],
    }),
    removeMember: builder.mutation<ApiResponse<void>, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: 'Team', id: teamId }, 'MyTeams'],
    }),
    deleteTeam: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
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
