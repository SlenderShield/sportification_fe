import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@core/config';
import { Chat, Message, SendMessageRequest, CreateChatRequest } from '@features/chat/types';
import { ApiResponse } from '../../types/api';
import { apiService } from '../../services/api';
import { unwrapApiResponse, unwrapNestedData } from '../../utils/apiHelpers';

export const chatApi = createApi({
  reducerPath: 'chatApi',
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
  tagTypes: ['Chat', 'Chats', 'Messages'],
  endpoints: (builder) => ({
    getChats: builder.query<Chat[], { page?: number; limit?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        return `/chats?${queryParams.toString()}`;
      },
      transformResponse: (response: ApiResponse<Chat[]>) => unwrapApiResponse(response),
      providesTags: ['Chats'],
    }),
    getChat: builder.query<Chat, string>({
      query: (id) => `/chats/${id}`,
      transformResponse: (response: ApiResponse<{ chat: Chat }>) => unwrapNestedData(response, 'chat'),
      providesTags: (result, error, id) => [{ type: 'Chat', id }],
    }),
    createChat: builder.mutation<Chat, CreateChatRequest>({
      query: (chatData) => ({
        url: '/chats',
        method: 'POST',
        body: chatData,
      }),
      transformResponse: (response: ApiResponse<{ chat: Chat }>) => unwrapNestedData(response, 'chat'),
      invalidatesTags: ['Chats'],
    }),
    getChatMessages: builder.query<Message[], { chatId: string; page?: number; limit?: number; before?: string; after?: string }>({
      query: ({ chatId, page, limit, before, after }) => {
        const params = new URLSearchParams();
        if (page) params.append('page', String(page));
        if (limit) params.append('limit', String(limit));
        if (before) params.append('before', before);
        if (after) params.append('after', after);
        return `/chats/${chatId}/messages?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse<Message[]>) => unwrapApiResponse(response),
      providesTags: (result, error, { chatId }) => [{ type: 'Messages', id: chatId }],
    }),
    sendMessage: builder.mutation<Message, { chatId: string; data: SendMessageRequest }>({
      query: ({ chatId, data }) => ({
        url: `/chats/${chatId}/messages`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<{ message: Message }>) => unwrapNestedData(response, 'message'),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Messages', id: chatId },
        { type: 'Chat', id: chatId },
        'Chats',
      ],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetChatQuery,
  useCreateChatMutation,
  useGetChatMessagesQuery,
  useLazyGetChatMessagesQuery,
  useSendMessageMutation,
} = chatApi;
