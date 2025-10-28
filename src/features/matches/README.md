# Matches Feature

## Purpose
Enable users to create, discover, join, and manage sports matches with real-time updates and AI-powered recommendations.

## Key Components

### Services
- **MatchService.ts**: Business logic for match operations
  - CRUD operations (create, read, update, delete)
  - Join/leave match with validation
  - Score updates and match status management
  - Business rule enforcement

### Screens
- **MatchesScreen.tsx**: Browse and search matches with filters
- **MatchDetailScreen.tsx**: View match details, participants, join/leave actions
- **CreateMatchScreen.tsx**: Create new match with form validation

### State Management
- **matchApi.ts**: RTK Query API for match CRUD operations
- **recommendationApi.ts**: AI-powered match recommendations
- **matchesSlice.ts**: UI state (filters, selected match)
- **matchesSelectors.ts**: Derived state selectors

### Repositories
- **MatchRepository.ts**: Data access layer for match API calls

### Types
- **match.ts**: Match, CreateMatchRequest, MatchFilters, MatchStatus interfaces

## Features Implemented

✅ Create matches with sport type, location, date/time  
✅ Browse matches with search and filters  
✅ Join/leave matches with validation  
✅ Real-time match updates via Socket.IO  
✅ Match scoring and status tracking  
✅ Participant management  
✅ AI-powered match recommendations  
✅ Location-based match discovery  
✅ Match notifications

## Dependencies

### External
- `socket.io-client` - Real-time updates
- `react-native-maps` - Location display
- `@react-native-community/geolocation` - Location services

### Internal
- `src/shared/hooks/useEntityActions` - Join/leave/delete actions
- `src/shared/components/templates/ListScreenTemplate` - List UI
- `src/shared/utils/dateUtils` - Date formatting
- `src/core/types/IService` - Service interface

## Integration Points

### Used By
- Tournaments feature (tournaments contain matches)
- Chat feature (match-based conversations)
- Notifications (match updates and invitations)

### Uses
- Auth feature for user authentication
- Venues feature for match location
- Teams feature for team-based matches
- Socket service for real-time updates

## Usage Example

```typescript
// Browse matches
import { useGetMatchesQuery } from '../store/matchApi';

const { data: matches, isLoading } = useGetMatchesQuery({
  sport: 'soccer',
  status: 'scheduled'
});

// Join a match
import { useJoinMatchMutation } from '../store/matchApi';

const [joinMatch] = useJoinMatchMutation();
await joinMatch(matchId).unwrap();

// Create a match
import { useCreateMatchMutation } from '../store/matchApi';

const [createMatch] = useCreateMatchMutation();
await createMatch({
  title: 'Weekend Soccer',
  sport: 'soccer',
  maxParticipants: 10,
  dateTime: new Date(),
  location: { lat: 37.78, lng: -122.4 }
}).unwrap();
```

## Business Rules

- Match title must be at least 3 characters
- Minimum 2 participants required
- Cannot join full matches
- Cannot join cancelled/completed matches
- Cannot leave matches in progress
- Scores cannot be negative
- Only match creator can update status
- Match owner can manage participants

## Reusability Notes

- **Pattern Reuse**: Entity management pattern shared with Teams/Tournaments
- **Hook Reuse**: `useEntityActions` abstracts common join/leave/delete logic
- **Template Reuse**: Screen templates reduce UI duplication
- **Service Pattern**: Service-Repository pattern applicable to other entities
- **Real-time Pattern**: Socket.IO integration pattern reusable for other features

## Code Duplication Warning

**Similar Patterns In**:
- `src/features/teams/` - Team management follows same structure
- `src/features/tournaments/` - Tournament management similar

**Recommendation**: Consider creating BaseEntityService for shared CRUD logic to reduce duplication across Matches, Teams, and Tournaments features.
