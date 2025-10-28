export interface Tournament {
  _id: string;
  name: string;
  description?: string;
  sport: string;
  type: 'elimination';
  format: 'single_elimination' | 'double_elimination' | 'round_robin';
  maxParticipants: number;
  currentParticipants: number;
  participants: TournamentParticipant[];
  status: 'registration_open' | 'in_progress' | 'completed' | 'cancelled';
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  venue?: {
    _id: string;
    name: string;
    location: {
      address: string;
    };
  };
  rules?: {
    matchFormat?: string;
    scoringSystem?: string;
    tiebreakRules?: string;
    skillLevelRequired?: string;
  };
  prize?: {
    total: number;
    currency: string;
    distribution?: {
      first?: number;
      second?: number;
      third?: number;
    };
  };
  bracket?: TournamentBracket;
  standings?: TournamentStanding[];
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  entryFee?: {
    amount: number;
    currency: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface TournamentParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  profile?: {
    skillLevel?: string;
  };
  seed?: number;
  joinedAt?: string;
}

export interface TournamentBracket {
  rounds: BracketRound[];
}

export interface BracketRound {
  round: number;
  matches: BracketMatch[];
}

export interface BracketMatch {
  matchId: string;
  player1?: string;
  player2?: string;
  winner?: string;
  status?: 'scheduled' | 'in_progress' | 'completed';
  scheduledAt?: string;
  score?: {
    player1?: number;
    player2?: number;
  };
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
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  venueId?: string;
  entryFee?: {
    amount: number;
    currency: string;
  };
}
