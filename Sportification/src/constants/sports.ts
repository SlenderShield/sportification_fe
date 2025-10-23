/**
 * Common sports configuration used across the application
 * Centralized to maintain consistency and ease updates
 */

export interface Sport {
  name: string;
  icon: string;
}

export const SPORTS: Sport[] = [
  { name: 'Football', icon: 'soccer' },
  { name: 'Basketball', icon: 'basketball' },
  { name: 'Tennis', icon: 'tennis' },
  { name: 'Volleyball', icon: 'volleyball' },
  { name: 'Cricket', icon: 'cricket' },
  { name: 'Baseball', icon: 'baseball' },
  { name: 'Badminton', icon: 'badminton' },
  { name: 'Table Tennis', icon: 'table-tennis' },
  { name: 'Other', icon: 'dots-horizontal' },
];

export const TOURNAMENT_FORMATS = [
  { name: 'single-elimination', icon: 'tournament', label: 'Single Elimination' },
  { name: 'double-elimination', icon: 'tournament', label: 'Double Elimination' },
  { name: 'round-robin', icon: 'repeat', label: 'Round Robin' },
  { name: 'swiss', icon: 'chess-rook', label: 'Swiss' },
];
