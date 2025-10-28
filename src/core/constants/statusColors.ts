/**
 * Centralized status color mappings
 * Used for consistent status badge colors across detail screens
 */

export const MATCH_STATUS_COLORS: Record<string, string> = {
  scheduled: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'error',
};

export const TOURNAMENT_STATUS_COLORS: Record<string, string> = {
  upcoming: 'info',
  registration: 'warning',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'error',
};
