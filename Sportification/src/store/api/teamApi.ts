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
  tagTypes: ['Team', 'Teams'],
  endpoints: (builder) => ({
    getTeams: builder.query<ApiResponse<PaginatedResponse<Team>>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/teams?page=${page}&limit=${limit}`,
      providesTags: ['Teams'],
    }),
    getTeam: builder.query<ApiResponse<Team>, string>({
      query: (id) => `/teams/${id}`,
      providesTags: (result, error, id) => [{ type: 'Team', id }],
    }),
    createTeam: builder.mutation<ApiResponse<Team>, CreateTeamRequest>({
      query: (teamData) => ({
        url: '/teams',
        method: 'POST',
        body: teamData,
      }),
      invalidatesTags: ['Teams'],
    }),
    updateTeam: builder.mutation<ApiResponse<Team>, { id: string; data: UpdateTeamRequest }>({
      query: ({ id, data }) => ({
        url: `/teams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Team', id }, 'Teams'],
    }),
    joinTeam: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/teams/${id}/join`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Team', id }, 'Teams'],
    }),
    leaveTeam: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/teams/${id}/leave`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Team', id }, 'Teams'],
    }),
    deleteTeam: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teams'],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useGetTeamQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useJoinTeamMutation,
  useLeaveTeamMutation,
  useDeleteTeamMutation,
} = teamApi;
