export interface Tournament {
  id: string;
  name: string;
  description?: string;
  sport: string;
  format: 'single_elimination' | 'double_elimination' | 'round_robin';
  maxParticipants: number;
  participants: TournamentParticipant[];
  schedule: {
    startDate: string;
    endDate: string;
  };
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  bracket?: TournamentBracket;
  standings?: TournamentStanding[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentParticipant {
  userId?: string;
  teamId?: string;
  name: string;
  seed?: number;
  joinedAt: string;
}

export interface TournamentBracket {
  rounds: BracketRound[];
}

export interface BracketRound {
  roundNumber: number;
  matches: BracketMatch[];
}

export interface BracketMatch {
  id: string;
  participant1?: string;
  participant2?: string;
  winner?: string;
  score?: {
    participant1: number;
    participant2: number;
  };
  scheduledTime?: string;
}

export interface TournamentStanding {
  participantId: string;
  name: string;
  wins: number;
  losses: number;
  points: number;
  rank: number;
}

export interface CreateTournamentRequest {
  name: string;
  description?: string;
  sport: string;
  format: 'single_elimination' | 'double_elimination' | 'round_robin';
  maxParticipants: number;
  schedule: {
    startDate: string;
    endDate: string;
  };
}
