import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import { authApi } from './api/authApi';
import { matchApi } from './api/matchApi';
import { tournamentApi } from './api/tournamentApi';
import { teamApi } from './api/teamApi';
import { venueApi } from './api/venueApi';
import { chatApi } from './api/chatApi';
import { notificationApi } from './api/notificationApi';
import { userApi } from './api/userApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [matchApi.reducerPath]: matchApi.reducer,
    [tournamentApi.reducerPath]: tournamentApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [venueApi.reducerPath]: venueApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      matchApi.middleware,
      tournamentApi.middleware,
      teamApi.middleware,
      venueApi.middleware,
      chatApi.middleware,
      notificationApi.middleware,
      userApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
