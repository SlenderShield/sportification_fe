# Teams Feature

## Purpose
Enable users to create and manage teams for organized sports activities.

## Key Components

### Services
- **TeamService.ts**: Business logic for team operations (CRUD, member management)

### Screens
- **TeamsScreen.tsx**: Browse and search teams
- **TeamDetailScreen.tsx**: View team details, members, and activities
- **CreateTeamScreen.tsx**: Create new team

### State Management
- **teamApi.ts**: RTK Query API for team CRUD operations
- **teamsSlice.ts**: UI state (filters, selected team)
- **teamsSelectors.ts**: Derived state selectors

### Repositories
- **TeamRepository.ts**: Data access layer for team API calls

### Types
- **team.ts**: Team, TeamMember, TeamFilters interfaces

## Features Implemented

✅ Create teams with name, sport, description  
✅ Browse teams with search and filters  
✅ Join/leave teams  
✅ Team member management  
✅ Team-based matches  
✅ Team statistics and history  
✅ Team invitations  
✅ Member roles (owner, admin, member)

## Dependencies

### Internal
- `src/shared/hooks/useEntityActions` - Join/leave/delete actions
- `src/shared/components/templates/ListScreenTemplate` - List UI
- `src/core/types/IService` - Service interface

## Integration Points

### Used By
- Matches feature (team-based matches)
- Tournaments feature (team competitions)
- Chat feature (team communication)

### Uses
- Auth feature for user authentication
- Notifications for team invitations

## Usage Example

```typescript
// Browse teams
import { useGetTeamsQuery } from '../store/teamApi';

const { data: teams } = useGetTeamsQuery({
  sport: 'soccer'
});

// Join a team
import { useJoinTeamMutation } from '../store/teamApi';

const [joinTeam] = useJoinTeamMutation();
await joinTeam(teamId).unwrap();

// Create a team
import { useCreateTeamMutation } from '../store/teamApi';

const [createTeam] = useCreateTeamMutation();
await createTeam({
  name: 'FC Warriors',
  sport: 'soccer',
  description: 'Competitive soccer team'
}).unwrap();
```

## Business Rules

- Team name must be unique and 3-50 characters
- Team must have at least one member (owner)
- Only owner can delete team
- Admins can manage members
- Cannot leave team if you're the only member

## Reusability Notes

- **Pattern**: Very similar to Matches feature structure
- **useEntityActions**: Reuses join/leave/delete hook
- **Template**: Uses same screen templates as Matches

## Code Duplication Warning

**Extremely Similar To**:
- `src/features/matches/` - Match management
- `src/features/tournaments/` - Tournament management

**Recommendation**: This is a prime candidate for abstraction. Consider creating:
- `BaseEntityService<T>` for shared CRUD logic
- `EntityDetailTemplate` for shared UI patterns
- `useEntityList` and `useEntityDetail` hooks

Current duplication: ~300-500 lines of similar code across these three features.
