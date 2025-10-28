# Sportification Architecture Documentation

## Overview

Sportification is a React Native application built with TypeScript, following a feature-based architecture pattern. The codebase emphasizes clean code principles, type safety, and maintainability.

## Architecture Principles

### Core Design Patterns

1. **Feature-Based Architecture**: Code is organized by features rather than technical layers
2. **Atomic Design**: UI components follow atomic design principles (atoms → molecules → organisms → templates)
3. **Container/Presenter Pattern**: Separation of business logic from presentation
4. **Repository Pattern**: Data access abstraction layer
5. **Dependency Injection**: Loose coupling through IoC container

### SOLID Principles

- **Single Responsibility**: Each module has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Consistent interfaces and contracts
- **Interface Segregation**: Minimal, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

## Folder Structure

```
src/
├── core/                      # Core application logic
│   ├── config/               # App configuration
│   ├── constants/            # Global constants
│   ├── di/                   # Dependency injection container
│   ├── errors/               # Error classes and handling
│   └── types/                # Global type definitions & interfaces
│
├── features/                  # Feature modules (domain-driven)
│   ├── auth/                 # Authentication & authorization
│   ├── matches/              # Match management
│   ├── teams/                # Team management
│   ├── tournaments/          # Tournament features
│   ├── venues/               # Venue management
│   ├── chat/                 # Real-time messaging
│   ├── profile/              # User profiles
│   └── notifications/        # Push notifications
│   
│   # Each feature module contains:
│   └── [feature]/
│       ├── components/       # Feature-specific components
│       ├── hooks/            # Feature-specific hooks
│       ├── screens/          # Feature screens
│       ├── services/         # Business logic
│       ├── store/            # Redux slices & API
│       ├── types/            # Feature types
│       └── utils/            # Feature utilities
│
├── shared/                    # Shared across features
│   ├── components/           # Reusable UI components
│   │   ├── atoms/            # Basic building blocks (Button, Input, etc.)
│   │   ├── molecules/        # Composite components (FormField, SearchBox, etc.)
│   │   ├── organisms/        # Complex components (Card, Modal, List, etc.)
│   │   └── templates/        # Layout templates (ScreenTemplate, ListTemplate, etc.)
│   ├── hooks/                # Shared custom hooks
│   ├── utils/                # Shared utilities
│   ├── contexts/             # React contexts
│   ├── services/             # Shared services
│   └── helpers/              # Helper functions
│
├── navigation/                # Navigation configuration
│   ├── navigators/           # Navigator components
│   └── types/                # Navigation types
│
├── store/                     # Global state management
│   ├── slices/               # Redux slices
│   └── hooks.ts              # Typed Redux hooks
│
├── theme/                     # Theming system
│   ├── theme.ts              # Theme definition
│   └── ThemeContext.tsx      # Theme provider
│
└── assets/                    # Static assets
    ├── images/
    ├── fonts/
    └── animations/
```

## Data Flow

### Request Flow

```
Screen/Component
    ↓
Custom Hook (useMatchesScreen)
    ↓
Service Layer (MatchService)
    ↓
Repository (MatchRepository)
    ↓
API Client / RTK Query
    ↓
Backend API
```

### State Management Flow

```
User Action
    ↓
Event Handler (Component)
    ↓
Custom Hook
    ↓
Redux Action / RTK Mutation
    ↓
Store Update
    ↓
Selector
    ↓
Component Re-render
```

## Key Layers

### 1. Presentation Layer

**Components**: Pure UI components that receive data and callbacks as props
- Located in `shared/components/` or `features/[feature]/components/`
- Follow atomic design principles
- Should be easily testable and reusable

**Screens**: Top-level route components
- Located in `features/[feature]/screens/`
- Use custom hooks for business logic
- Minimal logic - mostly composition

### 2. Business Logic Layer

**Custom Hooks**: Encapsulate component logic
- Located in `shared/hooks/` or `features/[feature]/hooks/`
- Handle state management, side effects, and business logic
- Return data and callbacks for components

**Services**: Domain-specific business logic
- Located in `features/[feature]/services/`
- Implement business rules and orchestration
- Use repositories for data access

### 3. Data Access Layer

**Repositories**: Abstract data sources
- Located in `features/[feature]/repositories/` (when implemented)
- Provide clean interfaces for data operations
- Handle caching, offline support, and data transformation

**API Layer**: HTTP communication
- RTK Query for API integration
- Type-safe API definitions
- Automatic caching and state management

### 4. State Management Layer

**Redux Store**: Global application state
- Feature slices for domain state
- RTK Query for server state
- Normalized state shape

**React Context**: Local/cross-cutting concerns
- Theme management
- Accessibility settings
- Authentication state

## Design Patterns

### Container/Presenter Pattern

```typescript
// Container (Logic)
export const MatchesScreen: React.FC = () => {
  const props = useMatchesScreen(); // Custom hook with logic
  return <MatchesView {...props} />;
};

// Presenter (UI)
export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  loading,
  onMatchPress,
}) => {
  // Pure UI rendering
  return <FlatList data={matches} renderItem={...} />;
};
```

### Custom Hooks Pattern

```typescript
export function useMatchesScreen() {
  // Data fetching
  const { data, loading, error } = useGetMatchesQuery();
  
  // Navigation
  const navigation = useNavigation();
  
  // Event handlers
  const handleMatchPress = useCallback((id: string) => {
    navigation.navigate('MatchDetail', { matchId: id });
  }, [navigation]);
  
  // Return props for component
  return {
    matches: data,
    loading,
    error,
    onMatchPress: handleMatchPress,
  };
}
```

### Service Pattern

```typescript
export class MatchService {
  constructor(
    private matchRepository: MatchRepository,
    private notificationService: NotificationService,
  ) {}
  
  async createMatch(data: CreateMatchDto): Promise<Match> {
    // Business logic
    const match = await this.matchRepository.create(data);
    
    // Side effects
    await this.notificationService.send({
      type: 'match_created',
      matchId: match.id,
    });
    
    return match;
  }
}
```

## Technology Stack

### Core Technologies
- **React Native**: 0.74.x - Mobile framework
- **TypeScript**: 5.x - Type safety
- **React Navigation**: 6.x - Navigation
- **Redux Toolkit**: 2.x - State management
- **RTK Query**: Data fetching and caching

### UI & Styling
- **React Native Paper**: UI components
- **React Native Reanimated**: Animations
- **React Native Vector Icons**: Icon library
- **Custom Theme System**: Dark/light mode support

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Jest**: Unit testing
- **React Testing Library**: Component testing

### Services & Integrations
- **Socket.IO**: Real-time communication
- **AsyncStorage**: Local storage
- **React Native Keychain**: Secure storage
- **Push Notifications**: Firebase/native modules

## Best Practices

### Code Organization

1. **Feature Colocation**: Keep related code together
2. **Clear Separation**: Distinct layers (UI, logic, data)
3. **Explicit Dependencies**: Use dependency injection
4. **Type Safety**: Leverage TypeScript fully

### Component Guidelines

1. **Single Responsibility**: One component, one purpose
2. **Prop Interfaces**: Always define prop types
3. **Composition**: Build complex UIs from simple parts
4. **Performance**: Use React.memo, useMemo, useCallback when appropriate

### State Management

1. **Local First**: Use local state when possible
2. **Server State**: Use RTK Query for API data
3. **Global State**: Use Redux only when necessary
4. **Normalized State**: Keep state flat and normalized

### Error Handling

1. **Error Boundaries**: Catch React errors
2. **Try/Catch**: Handle async errors
3. **User-Friendly**: Show meaningful error messages
4. **Logging**: Use logger service, not console

### Testing

1. **Test Behavior**: Test what users see and do
2. **Unit Tests**: Test utilities and business logic
3. **Integration Tests**: Test feature workflows
4. **Avoid Implementation Details**: Test the interface

## Security

### Authentication
- JWT tokens stored securely in Keychain
- Token refresh mechanism
- Automatic logout on token expiration

### Data Protection
- Sensitive data encrypted at rest
- HTTPS for all API communications
- Input validation and sanitization

### Authorization
- Role-based access control
- Permission checks in services
- Protected routes

## Performance Considerations

### Optimization Techniques
1. **Code Splitting**: Lazy load features
2. **Memoization**: Cache expensive computations
3. **Virtualization**: Use FlatList for long lists
4. **Image Optimization**: Compress and cache images
5. **Bundle Size**: Tree shaking and dead code elimination

### Monitoring
- Performance tracking with analytics
- Error monitoring
- User experience metrics

## Deployment

### Build Process
1. Development build
2. Staging build with production config
3. Production build with optimizations

### Environment Configuration
- Development
- Staging
- Production

### CI/CD
- Automated linting and testing
- Build verification
- Deployment to app stores

## Feature Mapping & Codebase Index

### Implemented Features

#### 1. Authentication & Authorization (`src/features/auth/`)
**Purpose**: User authentication with multiple providers and biometric support  
**Key Components**:
- Email/password authentication
- Social login (Google, Apple, Facebook)
- Biometric authentication (Face ID/Touch ID)
- Secure token storage via Keychain

**Services**: AuthService, BiometricService, GoogleAuthService, AppleAuthService, FacebookAuthService  
**Screens**: LoginScreen, RegisterScreen  
**Dependencies**: Firebase Auth, react-native-keychain, react-native-biometrics  
**Reusability**: Core auth logic used across all features

#### 2. Matches (`src/features/matches/`)
**Purpose**: Create, browse, join, and manage sports matches  
**Key Components**:
- Match creation with sport type, location, time
- Match discovery and filtering
- Join/leave match functionality
- Score tracking and match status management
- AI-powered match recommendations

**Services**: MatchService  
**Screens**: MatchesScreen, MatchDetailScreen, CreateMatchScreen  
**Store**: matchApi (RTK Query), matchesSlice, recommendationApi  
**Dependencies**: Socket.IO (real-time updates), Maps (location)  
**Reusability**: Pattern reusable for event management

#### 3. Teams (`src/features/teams/`)
**Purpose**: Create and manage teams for organized play  
**Key Components**:
- Team creation and management
- Member invitations and management
- Team-based matches

**Services**: TeamService  
**Screens**: TeamsScreen, TeamDetailScreen, CreateTeamScreen  
**Store**: teamApi (RTK Query), teamsSlice  
**Reusability**: Similar pattern to Matches

#### 4. Tournaments (`src/features/tournaments/`)
**Purpose**: Organize bracket-style tournaments  
**Key Components**:
- Tournament creation with bracket generation
- Tournament registration and participation
- Standings and rankings
- Multi-round competition tracking

**Services**: TournamentService  
**Screens**: TournamentsScreen, TournamentDetailScreen, CreateTournamentScreen  
**Store**: tournamentApi (RTK Query), tournamentsSlice  
**Dependencies**: Matches (tournaments contain matches)  
**Reusability**: Bracket logic reusable for competitions

#### 5. Venues (`src/features/venues/`)
**Purpose**: Discover and book sports venues  
**Key Components**:
- Venue discovery with map view
- Location-based search and filtering
- Venue booking with payment processing
- Distance calculations and directions

**Services**: VenueService, MapService, PaymentService  
**Screens**: VenuesScreen, VenueDetailScreen, CreateBookingScreen  
**Store**: venueApi (RTK Query), venuesSlice  
**Dependencies**: Google Maps, Stripe payments, Geolocation  
**Reusability**: Map and payment services reusable

#### 6. Chat (`src/features/chat/`)
**Purpose**: Real-time messaging between users, teams, and matches  
**Key Components**:
- One-on-one and group chat
- Real-time message delivery
- Typing indicators and read receipts
- Chat history and persistence

**Services**: ChatService  
**Screens**: ChatsScreen, ChatDetailScreen  
**Store**: chatApi (RTK Query)  
**Dependencies**: Socket.IO (real-time), shared/services/socketService  
**Reusability**: Real-time messaging pattern reusable

#### 7. Profile (`src/features/profile/`)
**Purpose**: User profiles, settings, friends, and payment management  
**Key Components**:
- Profile viewing and editing
- Password management
- App settings (theme, notifications, language)
- Accessibility settings
- Friends management
- Payment methods

**Services**: ProfileService, PaymentService  
**Components**: PaymentForm  
**Screens**: ProfileScreen, EditProfileScreen, SettingsScreen, AccessibilitySettingsScreen, FriendsScreen, ChangePasswordScreen  
**Store**: paymentApi (RTK Query)  
**Dependencies**: Stripe (payments), Biometrics  
**Reusability**: Payment form reusable across features

#### 8. Notifications (`src/features/notifications/`)
**Purpose**: Push notifications and in-app notification management  
**Key Components**:
- Firebase Cloud Messaging integration
- Local push notifications
- Notification history and management
- Notification permissions handling

**Services**: NotificationService  
**Screens**: NotificationsScreen  
**Store**: notificationApi (RTK Query)  
**Dependencies**: Firebase Messaging, Notifee  
**Reusability**: Notification service used across all features

### Shared Infrastructure

#### Core (`src/core/`)
- **config/**: API endpoints, Firebase configuration
- **constants/**: Sports types, status colors, global constants
- **di/**: Dependency injection container
- **errors/**: Custom error classes (ValidationError, AuthenticationError, BusinessError)
- **types/**: Global interfaces (IService, IRepository, ILogger)

#### Shared (`src/shared/`)
- **components/**: 45+ reusable components (Atomic Design)
  - atoms: Button, Input, Badge, Avatar, LoadingSpinner
  - molecules: SearchBar, DatePicker, EmptyState, SkeletonLoader
  - organisms: Card, BottomSheet, MapComponent, ErrorBoundary, FAB
  - templates: ListScreenTemplate, DetailScreenTemplate, FormScreenTemplate
- **hooks/**: useEntityActions, useDebounce, usePagination, useModal, useConfirmation
- **utils/**: dateUtils, formatUtils, validation, accessibility, hapticFeedback
- **services/**: api, socketService, analyticsService, notificationService, localizationService

#### State Management (`src/store/`)
- Redux Toolkit with Redux Persist
- RTK Query for API caching
- Typed hooks: useAppDispatch, useAppSelector

#### Navigation (`src/navigation/`)
- React Navigation (Stack + Bottom Tabs)
- Feature-based navigators: AuthNavigator, MainNavigator, MatchesNavigator, TeamsNavigator, TournamentsNavigator, VenuesNavigator, ProfileNavigator, ChatsNavigator

### Architecture Patterns

#### Consistent Feature Structure
All features follow the same pattern to ensure consistency and maintainability:
```
feature/
├── components/     # Feature-specific UI
├── hooks/          # Custom hooks (useFeatureScreen pattern)
├── screens/        # Screen components
├── services/       # Business logic (Service class implements IService)
├── repositories/   # Data access (Repository class implements IRepository)
├── store/          # RTK Query API + Redux slice
└── types/          # TypeScript interfaces
```

#### Code Reuse Opportunities
- **Entity Management Pattern**: Matches, Teams, Tournaments share similar CRUD operations
- **useEntityActions Hook**: Reusable for join/leave/delete actions across features
- **Screen Templates**: ListScreenTemplate, DetailScreenTemplate reduce duplication
- **Map Integration**: MapService and MapComponent reusable for location features
- **Payment Processing**: PaymentService and PaymentForm reusable for transactions

#### Preventing Code Duplication
**Before adding new features**:
1. Check if similar functionality exists in other features
2. Reuse shared components from `src/shared/components/`
3. Extend existing services rather than creating new ones
4. Follow established patterns (Repository, Service, Hook)
5. Use shared utilities from `src/shared/utils/`

**Redundancy Detected**:
- List/Detail/Form screens have similar patterns across Matches/Teams/Tournaments
- Service CRUD methods are repeated (opportunity for BaseService abstraction)
- Entity action handling is partially abstracted with useEntityActions

## Future Enhancements

### Planned Improvements
1. Offline-first architecture
2. Advanced caching strategies
3. Performance monitoring
4. Accessibility improvements
5. Internationalization (i18n)

---

**Document Version**: 2.0  
**Last Updated**: October 2025  
**Maintained By**: Development Team
