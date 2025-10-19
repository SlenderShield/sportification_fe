export interface User {
  id: string;
  email: string;
  username: string;
  profile: UserProfile;
  role: 'user' | 'admin' | 'moderator';
  isEmailVerified: boolean;
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
}

export interface UserStats {
  matchesPlayed: number;
  matchesWon: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
  totalScore: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
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
  tokens: AuthTokens;
  requiresMFA?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  profile?: Partial<UserProfile>;
}
