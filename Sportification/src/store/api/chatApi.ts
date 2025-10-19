import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';
import { Chat, Message, SendMessageRequest, CreateChatRequest } from '../../types/chat';
import { ApiResponse, PaginatedResponse } from '../../types/api';
import { apiService } from '../../services/api';

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
    getChats: builder.query<ApiResponse<PaginatedResponse<Chat>>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => `/chats?page=${page}&limit=${limit}`,
      providesTags: ['Chats'],
    }),
    getChat: builder.query<ApiResponse<Chat>, string>({
      query: (id) => `/chats/${id}`,
      providesTags: (result, error, id) => [{ type: 'Chat', id }],
    }),
    createChat: builder.mutation<ApiResponse<Chat>, CreateChatRequest>({
      query: (chatData) => ({
        url: '/chats',
        method: 'POST',
        body: chatData,
      }),
      invalidatesTags: ['Chats'],
    }),
    getChatMessages: builder.query<ApiResponse<PaginatedResponse<Message>>, { chatId: string; page?: number; limit?: number }>({
      query: ({ chatId, page = 1, limit = 50 }) => `/chats/${chatId}/messages?page=${page}&limit=${limit}`,
      providesTags: (result, error, { chatId }) => [{ type: 'Messages', id: chatId }],
    }),
    sendMessage: builder.mutation<ApiResponse<Message>, SendMessageRequest>({
      query: ({ chatId, content, type = 'text' }) => ({
        url: `/chats/${chatId}/messages`,
        method: 'POST',
        body: { content, type },
      }),
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
  useSendMessageMutation,
} = chatApi;
