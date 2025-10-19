export interface Team {
  id: string;
  name: string;
  description?: string;
  sport: string;
  avatar?: string;
  members: TeamMember[];
  captain: string;
  maxMembers?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  userId: string;
  username: string;
  avatar?: string;
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
  maxMembers?: number;
}
