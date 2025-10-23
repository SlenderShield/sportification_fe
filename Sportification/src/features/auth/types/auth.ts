export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  isVerified: boolean;
  profile: UserProfile;
  settings?: UserSettings;
  role?: 'user' | 'admin' | 'moderator';
  isOnline?: boolean;
  lastActiveAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  sports?: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  achievements?: Achievement[];
  statistics?: UserStats;
}

export interface UserSettings {
  privacy?: {
    profileVisibility?: 'public' | 'friends' | 'private';
    showEmail?: boolean;
    showLocation?: boolean;
  };
  notifications?: {
    email?: boolean;
    push?: boolean;
    types?: string[];
  };
}

export interface UserStats {
  matchesPlayed: number;
  matchesWon: number;
  winRate?: number;
  tournamentsJoined: number;
  tournamentsWon: number;
  averageRating?: number;
}

export interface Achievement {
  type: string;
  title: string;
  description: string;
  earnedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  profile?: {
    bio?: string;
    location?: string;
    sports?: string[];
    skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
}
