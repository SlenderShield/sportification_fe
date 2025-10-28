export interface Team {
  _id: string;
  name: string;
  description?: string;
  sport: string;
  avatar?: string;
  captain: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
      username: string;
    };
  };
  members: TeamMember[];
  chat?: {
    _id: string;
    type: string;
    name?: string;
  };
  memberCount: number;
  maxMembers: number;
  isFull: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TeamMember {
  user: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
      username: string;
    };
  };
  role: 'captain' | 'member';
  joinedAt: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  sport: string;
  maxMembers?: number;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  sport?: string;
  maxMembers?: number;
}
