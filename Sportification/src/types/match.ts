export interface Match {
  id: string;
  sport: string;
  title: string;
  description?: string;
  venue?: {
    id: string;
    name: string;
    address: string;
  };
  schedule: {
    startTime: string;
    endTime: string;
  };
  maxParticipants: number;
  participants: Participant[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  score?: MatchScore;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  userId: string;
  username: string;
  avatar?: string;
  joinedAt: string;
  status: 'confirmed' | 'pending' | 'declined';
}

export interface MatchScore {
  team1: number;
  team2: number;
  winner?: string;
}

export interface CreateMatchRequest {
  sport: string;
  title: string;
  description?: string;
  venueId?: string;
  schedule: {
    startTime: string;
    endTime: string;
  };
  maxParticipants: number;
}

export interface UpdateScoreRequest {
  team1: number;
  team2: number;
  winner?: string;
}

export interface MatchFilters {
  sport?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
