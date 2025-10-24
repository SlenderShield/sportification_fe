/**
 * Test data factories for creating mock entities
 */

import { Match } from '@features/matches/types';
import { Team } from '@features/teams/types';
import { Tournament } from '@features/tournaments/types';
import { Venue } from '@features/venues/types';
import { User } from '@features/auth/types';

/**
 * Create a mock user
 */
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  _id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  avatar: 'https://example.com/avatar.jpg',
  profile: {
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser',
    bio: 'Test bio',
    phoneNumber: '+1234567890',
    dateOfBirth: '1990-01-01',
    location: {
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
    },
  },
  ...overrides,
});

/**
 * Create a mock match
 */
export const createMockMatch = (overrides: Partial<Match> = {}): Match => ({
  _id: 'match-123',
  type: 'public',
  sport: 'Basketball',
  title: 'Test Match',
  description: 'Test match description',
  schedule: {
    date: '2025-01-15',
    time: '14:00',
    timezone: 'UTC',
    duration: 120,
  },
  maxParticipants: 10,
  currentParticipants: 5,
  participants: [],
  status: 'upcoming',
  createdBy: createMockUser(),
  createdAt: '2025-01-01T00:00:00Z',
  ...overrides,
});

/**
 * Create a mock team
 */
export const createMockTeam = (overrides: Partial<Team> = {}): Team => ({
  _id: 'team-123',
  name: 'Test Team',
  description: 'Test team description',
  sport: 'Basketball',
  captain: {
    _id: 'user-123',
    profile: {
      firstName: 'Test',
      lastName: 'Captain',
      username: 'testcaptain',
    },
  },
  members: [],
  memberCount: 5,
  maxMembers: 10,
  isFull: false,
  isActive: true,
  createdAt: '2025-01-01T00:00:00Z',
  ...overrides,
});

/**
 * Create a mock tournament
 */
export const createMockTournament = (overrides: Partial<Tournament> = {}): Tournament => ({
  _id: 'tournament-123',
  name: 'Test Tournament',
  description: 'Test tournament description',
  sport: 'Basketball',
  type: 'elimination',
  format: 'single_elimination',
  maxParticipants: 16,
  currentParticipants: 8,
  participants: [],
  status: 'registration_open',
  registrationDeadline: '2025-01-10T00:00:00Z',
  startDate: '2025-01-15T00:00:00Z',
  endDate: '2025-01-20T00:00:00Z',
  organizer: {
    _id: 'user-123',
    profile: {
      firstName: 'Test',
      lastName: 'Organizer',
      username: 'testorganizer',
    },
  },
  createdAt: '2025-01-01T00:00:00Z',
  ...overrides,
});

/**
 * Create a mock venue
 */
export const createMockVenue = (overrides: Partial<Venue> = {}): Venue => ({
  _id: 'venue-123',
  name: 'Test Venue',
  description: 'Test venue description',
  location: {
    address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345',
    country: 'Test Country',
  },
  sports: ['Basketball', 'Soccer'],
  facilities: ['Court', 'Locker Room'],
  amenities: ['Parking', 'WiFi'],
  images: ['https://example.com/image1.jpg'],
  status: 'active',
  isVerified: true,
  owner: {
    _id: 'user-123',
    profile: {
      firstName: 'Test',
      lastName: 'Owner',
    },
  },
  createdAt: '2025-01-01T00:00:00Z',
  ...overrides,
});

/**
 * Create multiple mock items
 */
export const createMockList = <T>(
  factory: (overrides?: Partial<T>) => T,
  count: number,
  overrides?: Partial<T>[]
): T[] => {
  return Array.from({ length: count }, (_, index) => 
    factory(overrides?.[index] || {})
  );
};
