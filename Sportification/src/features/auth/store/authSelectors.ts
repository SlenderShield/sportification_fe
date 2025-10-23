import { createSelector } from 'reselect';
import { RootState } from '@/store';

// Base selector
const selectAuthState = (state: RootState) => state.auth;

// Memoized selectors
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectIsLoading = createSelector(
  [selectAuthState],
  (auth) => auth.isLoading
);

export const selectUserId = createSelector(
  [selectUser],
  (user) => user?._id || user?.id || null
);

export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email || null
);

export const selectUserName = createSelector(
  [selectUser],
  (user) => user?.name || null
);

export const selectUserAvatar = createSelector(
  [selectUser],
  (user) => user?.avatar || null
);

export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.role || 'user'
);

// Derived selectors
export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === 'admin'
);

export const selectAuthStatus = createSelector(
  [selectIsAuthenticated, selectIsLoading],
  (isAuthenticated, isLoading) => ({
    isAuthenticated,
    isLoading,
    isReady: !isLoading,
  })
);
