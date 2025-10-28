# Tournaments Feature

## Purpose
Organize and manage bracket-style tournaments with multiple rounds and standings.

## Key Components

### Services
- **TournamentService.ts**: Business logic for tournament operations and bracket management

### Screens
- **TournamentsScreen.tsx**: Browse and search tournaments
- **TournamentDetailScreen.tsx**: View tournament brackets, standings, and schedule
- **CreateTournamentScreen.tsx**: Create tournament with bracket configuration

### State Management
- **tournamentApi.ts**: RTK Query API for tournament CRUD operations
- **tournamentsSlice.ts**: UI state (filters, selected tournament)
- **tournamentsSelectors.ts**: Derived state selectors

### Repositories
- **TournamentRepository.ts**: Data access layer for tournament API calls

### Types
- **tournament.ts**: Tournament, Bracket, Standing, Round interfaces

## Features Implemented

✅ Create tournaments with format (single/double elimination, round robin)  
✅ Browse tournaments with filters  
✅ Join/register for tournaments  
✅ Bracket generation and visualization  
✅ Standings and rankings  
✅ Multi-round competition tracking  
✅ Match scheduling within tournaments  
✅ Winner determination  
✅ Tournament statistics  
✅ Participant management

## Dependencies

### Internal
- `src/features/matches/` - Tournaments contain matches (implicit)
- `src/shared/hooks/useEntityActions` - Join/leave/delete actions
- `src/shared/components/templates/ListScreenTemplate` - List UI
- `src/core/types/IService` - Service interface

## Integration Points

### Used By
- Chat feature (tournament discussions)
- Notifications (tournament updates)

### Uses
- Auth feature for user authentication
- Matches feature for tournament matches
- Teams feature for team-based tournaments

## Usage Example

```typescript
// Browse tournaments
import { useGetTournamentsQuery } from '../store/tournamentApi';

const { data: tournaments } = useGetTournamentsQuery({
  sport: 'soccer',
  status: 'registration_open'
});

// Register for tournament
import { useJoinTournamentMutation } from '../store/tournamentApi';

const [joinTournament] = useJoinTournamentMutation();
await joinTournament(tournamentId).unwrap();

// Create a tournament
import { useCreateTournamentMutation } from '../store/tournamentApi';

const [createTournament] = useCreateTournamentMutation();
await createTournament({
  name: 'Summer Cup 2025',
  sport: 'soccer',
  format: 'single_elimination',
  maxParticipants: 16,
  startDate: new Date()
}).unwrap();
```

## Business Rules

- Tournament name must be unique and 3-100 characters
- Participant count must be power of 2 for elimination brackets
- Registration closes before tournament starts
- Bracket generated once registration closes
- Match results determine bracket progression
- Only tournament organizer can modify structure
- Participants can withdraw before tournament starts

## Unique Features

- **Bracket Generation**: Automatic bracket creation based on format
- **Standing Calculations**: Real-time ranking updates
- **Multi-Round Logic**: Complex progression rules
- **Seeding**: Support for seeded and random bracket generation

## Reusability Notes

- **Bracket Logic**: Reusable for any competition system
- **Standings Calculation**: Applicable to leagues and seasons
- **Pattern**: Similar structure to Matches/Teams (see duplication warning)

## Code Duplication Warning

**Similar To**:
- `src/features/matches/` - Match management (CRUD, join/leave)
- `src/features/teams/` - Team management (CRUD, join/leave)

**Shared Patterns**:
- Service layer CRUD methods (~150 lines)
- Screen structure and hooks (~200 lines)
- RTK Query API setup (~100 lines)

**Recommendation**: 
- Extract common CRUD logic into `BaseEntityService`
- Create shared screen templates
- Total duplication across 3 features: ~500 lines

**Unique To Keep**:
- Bracket generation algorithm
- Standing calculation logic
- Multi-round progression
