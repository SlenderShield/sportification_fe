import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import { authApi } from '@features/auth/store';
import { userApi } from '@features/auth/store';
import { matchApi } from '@features/matches/store';
import { recommendationApi } from '@features/matches/store';
import { tournamentApi } from '@features/tournaments/store';
import { teamApi } from '@features/teams/store';
import { venueApi } from '@features/venues/store';
import { chatApi } from '@features/chat/store';
import { notificationApi } from '@features/notifications/store';
import { paymentApi } from '@features/profile/store';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [matchApi.reducerPath]: matchApi.reducer,
  [tournamentApi.reducerPath]: tournamentApi.reducer,
  [teamApi.reducerPath]: teamApi.reducer,
  [venueApi.reducerPath]: venueApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [recommendationApi.reducerPath]: recommendationApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      matchApi.middleware,
      tournamentApi.middleware,
      teamApi.middleware,
      venueApi.middleware,
      chatApi.middleware,
      notificationApi.middleware,
      userApi.middleware,
      paymentApi.middleware,
      recommendationApi.middleware
    ),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
