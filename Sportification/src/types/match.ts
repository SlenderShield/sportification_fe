export interface Match {
  _id: string;
  type: 'public' | 'private';
  sport: string;
  title: string;
  description?: string;
  venue?: Venue;
  schedule: {
    date: string;
    time: string;
    timezone: string;
    duration: number;
  };
  maxParticipants: number;
  currentParticipants: number;
  participants: Participant[];
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  rules?: {
    format?: string;
    scoringSystem?: string;
    skillLevel?: string;
    equipment?: string;
  };
  requirements?: {
    minSkillLevel?: string;
    maxSkillLevel?: string;
    ageRange?: {
      min: number;
      max: number;
    };
  };
  score?: MatchScore;
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  chat?: {
    _id: string;
    unreadCount?: number;
  };
  inviteCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  _id: string;
  name: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  amenities?: string[];
}

export interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  role?: 'organizer' | 'participant';
  profile?: {
    skillLevel?: string;
  };
}

export interface MatchScore {
  team1?: number;
  team2?: number;
  winner?: string;
}

export interface CreateMatchRequest {
  type: 'public' | 'private';
  sport: string;
  title: string;
  description?: string;
  maxParticipants: number;
  schedule: {
    date: string;
    time: string;
    timezone: string;
    duration: number;
  };
  venue?: string;
  rules?: {
    format?: string;
    scoringSystem?: string;
    skillLevel?: string;
    equipment?: string;
  };
  requirements?: {
    minSkillLevel?: string;
    maxSkillLevel?: string;
    ageRange?: {
      min: number;
      max: number;
    };
  };
}

export interface UpdateScoreRequest {
  team1?: number;
  team2?: number;
  winner?: string;
}

export interface MatchFilters {
  sport?: string;
  status?: string;
  type?: string;
  date?: string;
  location?: string;
  page?: number;
  limit?: number;
}
