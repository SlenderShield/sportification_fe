# Sportification Codebase Index & Feature Map

**Version:** 2.0  
**Last Updated:** October 28, 2025  
**Purpose:** Complete reference guide for all implemented features, modules, and architecture patterns to prevent code duplication and ensure consistency.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Feature Module Index](#feature-module-index)
4. [Shared Components Index](#shared-components-index)
5. [Core Infrastructure](#core-infrastructure)
6. [State Management](#state-management)
7. [Services & Utilities](#services--utilities)
8. [Navigation Structure](#navigation-structure)
9. [Redundancy Analysis](#redundancy-analysis)
10. [Best Practices & Patterns](#best-practices--patterns)
11. [Recommendations](#recommendations)

---

## Executive Summary

**Total TypeScript Files:** 283  
**Main Features:** 8 (Auth, Matches, Teams, Tournaments, Venues, Chat, Profile, Notifications)  
**Shared Components:** 45+ (Atoms: 11, Molecules: 9, Organisms: 20, Templates: 4)  
**Architecture Pattern:** Feature-based with Repository & Service layers  
**Design System:** Atomic Design (Atoms → Molecules → Organisms → Templates)  
**State Management:** Redux Toolkit + RTK Query  
**Dependencies:** 1,377 npm packages installed

### Key Statistics
- **Barrel Exports:** 73 index.ts files for clean imports
- **Test Coverage:** No existing tests (0 test files)
- **Documentation:** 46 markdown files
- **Service Layer:** 24 service files across features
- **Repository Layer:** 16 repository files
- **Redux Slices:** 5 main slices (auth, matches, teams, tournaments, venues)
- **RTK Query APIs:** 11 API definitions

---

## Architecture Overview

### Design Principles

1. **Feature-Based Architecture**: Code organized by domain features, not technical layers
2. **Repository Pattern**: Data access abstraction for all API calls
3. **Service Layer**: Business logic separated from UI
4. **Dependency Injection**: IoC container for loose coupling
5. **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
6. **Atomic Design**: UI components organized hierarchically

### Folder Structure

```
src/
├── core/                    # Core infrastructure (config, constants, types, DI)
├── features/                # 8 feature modules (auth, matches, teams, etc.)
│   └── [feature]/
│       ├── components/      # Feature-specific components
│       ├── hooks/           # Feature-specific hooks
│       ├── screens/         # Feature screens
│       ├── services/        # Business logic layer
│       ├── store/           # Redux slices & RTK Query APIs
│       ├── repositories/    # Data access layer
│       └── types/           # Feature-specific types
├── shared/                  # Shared across all features
│   ├── components/          # Atomic design components
│   ├── hooks/               # Reusable hooks
│   ├── utils/               # Utility functions
│   ├── services/            # Shared services
│   └── contexts/            # React contexts
├── navigation/              # Navigation configuration
├── store/                   # Global Redux store
├── theme/                   # Theming system
└── assets/                  # Static assets
```

---

## Feature Module Index

### 1. Authentication & Authorization (`src/features/auth/`)

**Purpose:** User authentication, registration, social login, and biometric authentication

**Key Files:**
- **Screens** (3):
  - `LoginScreen.tsx` - Email/password and social login
  - `RegisterScreen.tsx` - User registration
  
- **Services** (5):
  - `AuthService.ts` - Core auth business logic (login, register, logout)
  - `biometricService.ts` - Face ID/Touch ID authentication
  - `googleAuthService.ts` - Google Sign-In integration
  - `appleAuthService.ts` - Apple Sign-In integration
  - `facebookAuthService.ts` - Facebook Login integration

- **Store** (4):
  - `authSlice.ts` - Auth state management (user, token, isAuthenticated)
  - `authApi.ts` - Login, register, logout endpoints
  - `userApi.ts` - User profile CRUD operations
  - `authSelectors.ts` - Memoized selectors for auth state

- **Repositories** (1):
  - `AuthRepository.ts` - API calls for authentication

- **Hooks** (2):
  - `useLoginScreen.ts` - Login screen logic
  - `useRegisterScreen.ts` - Registration screen logic

**Dependencies:**
- `@react-native-google-signin/google-signin`
- `@invertase/react-native-apple-authentication`
- `react-native-fbsdk-next`
- `react-native-biometrics`
- `react-native-keychain` (secure token storage)

**Reusability:** High - Used by all features requiring authenticated requests

**Duplication Risk:** Low - Centralized authentication logic

---

### 2. Matches (`src/features/matches/`)

**Purpose:** Create, browse, join, and manage sports matches with real-time updates

**Key Files:**
- **Screens** (3):
  - `MatchesScreen.tsx` - List all matches with filtering
  - `MatchDetailScreen.tsx` - View match details, join/leave
  - `CreateMatchScreen.tsx` - Create new matches

- **Services** (1):
  - `MatchService.ts` (224 lines) - Business logic: validation, join/leave rules, score updates

- **Store** (4):
  - `matchesSlice.ts` - Local state (filters, selected match)
  - `matchApi.ts` - CRUD operations, join/leave, score updates
  - `recommendationApi.ts` - AI-powered match recommendations
  - `matchesSelectors.ts` - Derived state selectors

- **Repositories** (1):
  - `MatchRepository.ts` (80 lines) - API integration

- **Hooks** (3):
  - `useMatchesScreen.ts` - List screen logic
  - `useMatchDetailScreen.ts` - Detail screen logic
  - `useCreateMatchScreen.ts` - Form handling

**Business Rules:**
- Match title must be ≥3 characters
- Minimum 2 participants required
- Cannot join full/cancelled/completed matches
- Cannot leave in-progress matches
- Scores cannot be negative

**Dependencies:**
- Maps integration for location display
- Socket.IO for real-time updates
- `useEntityActions` hook for common actions

**Reusability:** Medium - Match patterns can inform other entity management

**Duplication Risk:** Medium - Similar patterns to Teams/Tournaments

---

### 3. Teams (`src/features/teams/`)

**Purpose:** Create, manage, and organize teams for sports activities

**Key Files:**
- **Screens** (3):
  - `TeamsScreen.tsx` - List all teams
  - `TeamDetailScreen.tsx` - View team details, members
  - `CreateTeamScreen.tsx` - Create new team

- **Services** (1):
  - `TeamService.ts` - Business logic similar to MatchService

- **Store** (4):
  - `teamsSlice.ts` - Team state management
  - `teamApi.ts` - CRUD operations
  - `teamsSelectors.ts` - Selectors

- **Repositories** (1):
  - `TeamRepository.ts` (79 lines)

- **Hooks** (3):
  - `useTeamsScreen.ts`
  - `useTeamDetailScreen.ts`
  - `useCreateTeamScreen.ts`

**Dependencies:**
- Similar to Matches feature
- Uses shared `useEntityActions` hook

**Reusability:** High - Template for entity management

**Duplication Risk:** High - Very similar to Matches/Tournaments (see Redundancy Analysis)

---

### 4. Tournaments (`src/features/tournaments/`)

**Purpose:** Organize bracket-style tournaments with standings and participant management

**Key Files:**
- **Screens** (3):
  - `TournamentsScreen.tsx` - List tournaments
  - `TournamentDetailScreen.tsx` - View brackets, standings
  - `CreateTournamentScreen.tsx` - Tournament setup

- **Services** (1):
  - `TournamentService.ts` - Tournament-specific business logic

- **Store** (4):
  - `tournamentsSlice.ts`
  - `tournamentApi.ts`
  - `tournamentsSelectors.ts`

- **Repositories** (1):
  - `TournamentRepository.ts` (44 lines)

- **Hooks** (3):
  - `useTournamentsScreen.ts`
  - `useTournamentDetailScreen.ts`
  - `useCreateTournamentScreen.ts`

**Unique Features:**
- Bracket generation and management
- Standing/ranking calculations
- Multi-round competition logic

**Dependencies:**
- Matches (tournaments contain matches)
- Teams (team-based tournaments)

**Reusability:** Medium - Bracket logic is reusable

**Duplication Risk:** High - Screen patterns mirror Matches/Teams

---

### 5. Venues (`src/features/venues/`)

**Purpose:** Discover and book sports venues with location-based search and payments

**Key Files:**
- **Screens** (3):
  - `VenuesScreen.tsx` - Browse venues with map
  - `VenueDetailScreen.tsx` - Venue details, booking
  - `CreateBookingScreen.tsx` - Book venue with payment

- **Services** (2):
  - `VenueService.ts` (112 lines) - Venue business logic
  - `mapService.ts` (154 lines) - Location utilities, distance calculations, geocoding

- **Store** (4):
  - `venuesSlice.ts`
  - `venueApi.ts` - CRUD + booking operations
  - `venuesSelectors.ts`

- **Repositories** (1):
  - `VenueRepository.ts` (45 lines)

- **Hooks** (3):
  - `useVenuesScreen.ts`
  - `useVenueDetailScreen.ts`
  - `useCreateBookingScreen.ts`

**Unique Features:**
- Google Maps integration
- Location-based search and filtering
- Distance calculations
- Stripe payment processing

**Dependencies:**
- `react-native-maps`
- `@react-native-community/geolocation`
- `@stripe/stripe-react-native`
- `MapComponent` (shared organism)

**Reusability:** High - `mapService.ts` is reusable for any location feature

**Duplication Risk:** Low - Unique domain logic

---

### 6. Chat (`src/features/chat/`)

**Purpose:** Real-time messaging for users, teams, and matches

**Key Files:**
- **Screens** (2):
  - `ChatsScreen.tsx` - List of conversations
  - `ChatDetailScreen.tsx` - Message thread

- **Services** (1):
  - `ChatService.ts` - Message handling, real-time updates

- **Store** (2):
  - `chatApi.ts` - Message CRUD operations

- **Repositories** (1):
  - `ChatRepository.ts` (43 lines)

- **Hooks** (2):
  - `useChatsScreen.ts`
  - `useChatDetailScreen.ts`

**Unique Features:**
- Socket.IO real-time messaging
- Message read status
- Typing indicators
- Group chat support

**Dependencies:**
- `socket.io-client`
- `socketService` (shared service)

**Reusability:** Medium - Chat patterns reusable for comments/forums

**Duplication Risk:** Low - Unique domain

---

### 7. Profile (`src/features/profile/`)

**Purpose:** User profiles, settings, friends, and payment management

**Key Files:**
- **Screens** (6):
  - `ProfileScreen.tsx` - User profile view
  - `EditProfileScreen.tsx` - Edit profile details
  - `SettingsScreen.tsx` - App settings
  - `AccessibilitySettingsScreen.tsx` - A11y preferences
  - `FriendsScreen.tsx` - Friends list, search
  - `ChangePasswordScreen.tsx` - Password update

- **Components** (1):
  - `PaymentForm.tsx` - Stripe payment form

- **Services** (2):
  - `ProfileService.ts` - Profile business logic
  - `paymentService.ts` - Stripe initialization and utilities

- **Store** (2):
  - `paymentApi.ts` - Payment intent creation, confirmation

- **Repositories** (1):
  - `ProfileRepository.ts` (31 lines)

- **Hooks** (5):
  - `useProfileScreen.ts`
  - `useEditProfileScreen.ts`
  - `useSettingsScreen.ts`
  - `useFriendsScreen.ts`
  - `useChangePasswordScreen.ts`

**Unique Features:**
- Stripe payment processing
- Biometric authentication setup
- Accessibility settings
- Friends/social network

**Dependencies:**
- `@stripe/stripe-react-native`
- Auth feature for user data

**Reusability:** Medium - Payment logic reusable

**Duplication Risk:** Low - Unique profile logic

---

### 8. Notifications (`src/features/notifications/`)

**Purpose:** Push notifications and in-app notification management

**Key Files:**
- **Screens** (1):
  - `NotificationsScreen.tsx` - Notification list

- **Services** (1):
  - `NotificationService.ts` - Notification handling

- **Store** (2):
  - `notificationApi.ts` - Notification CRUD

- **Repositories** (1):
  - `NotificationRepository.ts` (41 lines)

- **Hooks** (1):
  - `useNotificationsScreen.ts`

**Unique Features:**
- Firebase Cloud Messaging integration
- Local push notifications
- Notification permissions handling
- Notification categories

**Dependencies:**
- `@react-native-firebase/messaging`
- `@notifee/react-native`
- `notificationService` (shared)

**Reusability:** High - Notification patterns used across features

**Duplication Risk:** Low - Centralized notification logic

---

## Shared Components Index

### Atoms (Basic Building Blocks)

Located in `src/shared/components/atoms/`

| Component | Purpose | Props | Reusability |
|-----------|---------|-------|-------------|
| `Avatar.tsx` | User avatar with fallback | size, uri, name | High - Used in profiles, lists |
| `Badge.tsx` | Status badges | count, variant, color | High - Used for counts, status |
| `Button.tsx` | Primary action button | title, onPress, variant, disabled | Very High - Used everywhere |
| `Chip.tsx` | Filter/tag chips | label, selected, onPress | High - Filters, tags |
| `Divider.tsx` | Visual separator | spacing, color | High - Lists, sections |
| `Input.tsx` | Text input field | value, onChange, placeholder, error | Very High - All forms |
| `LoadingSpinner.tsx` | Loading indicator | size, color | High - Loading states |
| `LottieLoader.tsx` | Animated loading | animation, size | Medium - Enhanced loading |
| `ProgressBar.tsx` | Progress indicator | progress, color | Medium - Forms, uploads |
| `Toast.tsx` | Toast notification | message, type, duration | High - User feedback |

**Dependencies:** React Native core components, theme system

---

### Molecules (Composite Components)

Located in `src/shared/components/molecules/`

| Component | Purpose | Key Features | Used By |
|-----------|---------|--------------|---------|
| `DatePicker.tsx` | Date selection | Native date picker, formatting | Match/Tournament creation |
| `DetailRow.tsx` | Key-value display | Icon, label, value | Detail screens |
| `EmptyState.tsx` | Empty list message | Icon, message, action button | All list screens |
| `IconButton.tsx` | Icon-only button | Icon, onPress, size | Headers, toolbars |
| `SearchBar.tsx` | Search input | Debounced input, clear button | List screens |
| `SectionHeader.tsx` | List section header | Title, action button | Lists |
| `SkeletonLoader.tsx` | Loading placeholder | Animated skeleton UI | List loading states |
| `TimePicker.tsx` | Time selection | Native time picker | Match scheduling |

**Composition:** Atoms + layout/behavior

---

### Organisms (Complex Components)

Located in `src/shared/components/organisms/`

| Component | Purpose | Dependencies | Complexity |
|-----------|---------|--------------|------------|
| `ActionButtons.tsx` | Button group | Button atom | Low |
| `AdvancedSearch.tsx` | Multi-field search | Input, Chip, Button | High |
| `AnimatedToast.tsx` | Animated notifications | Reanimated | Medium |
| `BottomSheet.tsx` | Modal bottom sheet | Gesture Handler | High |
| `Card.tsx` | Content card | Multiple atoms | Medium |
| `Celebration.tsx` | Success animations | Lottie | Medium |
| `ErrorBoundary.tsx` | Error catching | React Error Boundary | Medium |
| `FAB.tsx` | Floating action button | Button, animations | Medium |
| `FeatureErrorBoundary.tsx` | Feature-level errors | ErrorBoundary | Medium |
| `FilterChips.tsx` | Filter chip group | Chip | Medium |
| `MapComponent.tsx` | Map view | react-native-maps | High |
| `NotificationCard.tsx` | Notification item | Card, Avatar | Medium |
| `OfflineIndicator.tsx` | Network status | NetInfo | Low |
| `OptimizedImage.tsx` | Performance image | Image caching | Medium |
| `ParticipantList.tsx` | User list | Avatar, flatlist | Medium |
| `ScreenErrorBoundary.tsx` | Screen-level errors | ErrorBoundary | Medium |
| `SortFilter.tsx` | Sort/filter controls | Chip, BottomSheet | High |
| `SportSelector.tsx` | Sport picker | Chip, BottomSheet | Medium |
| `SwipeableCard.tsx` | Swipeable card | Gesture Handler | High |

**Key Organisms:**
- **MapComponent**: Used in Venues, Matches for location display (react-native-maps wrapper)
- **BottomSheet**: Used for filters, pickers, forms (reusable modal pattern)
- **ErrorBoundary**: Multiple levels (Screen, Feature, App) for error isolation

---

### Templates (Layout Templates)

Located in `src/shared/components/templates/`

| Template | Purpose | Includes | Usage |
|----------|---------|----------|-------|
| `DetailScreenTemplate.tsx` | Detail screen layout | ScrollView, loading, error states | Match/Team/Tournament details |
| `EmptyScreenTemplate.tsx` | Empty state layout | EmptyState, action button | Lists with no data |
| `FormScreenTemplate.tsx` | Form screen layout | Form validation, submit button | Create/Edit screens |
| `ListScreenTemplate.tsx` | List screen layout | FlatList, search, filter, pagination | All list screens |

**Reusability:** Very High - Consistent layouts across all features

---

## Core Infrastructure

### Configuration (`src/core/config/`)

| File | Purpose | Contents |
|------|---------|----------|
| `api.ts` | API configuration | Base URL, timeout, headers |
| `firebase.ts` | Firebase config | Analytics, Crashlytics, Messaging setup |
| `index.ts` | Exports | Barrel export |

**Environment Variables:**
- `API_BASE_URL` - Backend API endpoint
- `SOCKET_URL` - WebSocket server
- `STRIPE_PUBLISHABLE_KEY` - Stripe payments
- `GOOGLE_MAPS_API_KEY_*` - Maps integration
- `FIREBASE_*` - Firebase services

---

### Constants (`src/core/constants/`)

| File | Purpose | Contents |
|------|---------|----------|
| `sports.ts` | Sports types | List of sports, icons, categories |
| `statusColors.ts` | Status colors | Color mappings for status indicators |
| `index.ts` | Exports | Barrel export |

**Reusability:** Very High - Used across all features

---

### Types (`src/core/types/`)

| File | Purpose | Key Interfaces |
|------|---------|----------------|
| `IService.ts` | Service interface | `IService` with initialize/cleanup |
| `IRepository.ts` | Repository interface | `IRepository<T>` with CRUD methods |
| `ILogger.ts` | Logger interface | Logging abstraction |
| `INavigationService.ts` | Navigation interface | Type-safe navigation |
| `api.ts` | API types | `ApiResponse<T>`, `ApiError`, `PaginatedResponse` |

**Pattern:** Interface-based design for dependency injection

---

### Dependency Injection (`src/core/di/`)

| File | Purpose | Implementation |
|------|---------|----------------|
| `Container.ts` | IoC Container | Service registration and resolution |
| `ContainerProvider.tsx` | React context | Provides container to React tree |
| `index.ts` | Exports | Barrel export |

**Usage:** Minimal - DI infrastructure exists but underutilized

---

### Error Handling (`src/core/errors/`)

| File | Purpose | Error Classes |
|------|---------|---------------|
| `AppError.ts` | Custom errors | `AppError`, `ValidationError`, `AuthenticationError`, `BusinessError`, `NetworkError` |

**Pattern:** Typed error hierarchy for better error handling

---

## State Management

### Redux Store Structure

Located in `src/store/` and feature-level `store/` directories

#### Global Store (`src/store/`)

- **index.ts** - Store configuration with Redux Persist
- **hooks.ts** - Typed `useAppDispatch`, `useAppSelector`
- **middleware/** - Custom middleware (if any)
- **selectors/** - Cross-feature selectors

#### Feature Slices

| Feature | Slice | Purpose | State Shape |
|---------|-------|---------|-------------|
| Auth | `authSlice.ts` | User auth state | `{ user, token, isAuthenticated, loading }` |
| Matches | `matchesSlice.ts` | Match filters, UI state | `{ filters, selectedMatchId, viewMode }` |
| Teams | `teamsSlice.ts` | Team filters, UI state | `{ filters, selectedTeamId }` |
| Tournaments | `tournamentsSlice.ts` | Tournament state | `{ filters, selectedTournamentId }` |
| Venues | `venuesSlice.ts` | Venue filters, map state | `{ filters, mapRegion, selectedVenueId }` |

**Pattern:** Slices for UI state, RTK Query for server state

---

### RTK Query APIs

| Feature | API File | Endpoints | Cache Tags |
|---------|----------|-----------|------------|
| Auth | `authApi.ts` | login, register, logout | User |
| Auth | `userApi.ts` | getProfile, updateProfile | User |
| Matches | `matchApi.ts` | getMatches, getMatch, createMatch, updateMatch, deleteMatch, joinMatch, leaveMatch | Match |
| Matches | `recommendationApi.ts` | getRecommendations | Recommendation |
| Teams | `teamApi.ts` | getTeams, getTeam, createTeam, updateTeam, deleteTeam, joinTeam, leaveTeam | Team |
| Tournaments | `tournamentApi.ts` | getTournaments, getTournament, createTournament, updateTournament, deleteTournament, joinTournament, leaveTournament | Tournament |
| Venues | `venueApi.ts` | getVenues, getVenue, createBooking, getBookings | Venue, Booking |
| Chat | `chatApi.ts` | getChats, getMessages, sendMessage | Chat, Message |
| Notifications | `notificationApi.ts` | getNotifications, markAsRead, deleteNotification | Notification |
| Profile | `paymentApi.ts` | createPaymentIntent, confirmPayment, getPaymentHistory | Payment |

**Pattern:** Centralized API calls with automatic caching and invalidation

---

## Services & Utilities

### Shared Services (`src/shared/services/`)

| Service | Purpose | Key Functions | Dependencies |
|---------|---------|---------------|--------------|
| `api.ts` | API client | Axios wrapper with interceptors | axios |
| `socketService.ts` | WebSocket client | Socket.IO connection management | socket.io-client |
| `analyticsService.ts` | Analytics | Track events, screen views | Firebase Analytics |
| `notificationService.ts` | Push notifications | Request permissions, handle notifications | Firebase, Notifee |
| `localizationService.ts` | i18n | Language switching, translations | i18next |

**Reusability:** Very High - Core services used by all features

---

### Shared Utilities (`src/shared/utils/`)

| Utility | Purpose | Key Functions | Usage |
|---------|---------|---------------|-------|
| `dateUtils.ts` | Date formatting | formatDate, parseDate, isToday, etc. | Timestamps across app |
| `formatUtils.ts` | String formatting | formatCurrency, formatPhone, truncate | Display formatting |
| `validation.ts` | Form validation | Email, phone, password validators | Form validation |
| `stringUtils.ts` | String manipulation | capitalize, slugify, sanitize | Text processing |
| `arrayUtils.ts` | Array utilities | unique, groupBy, sortBy | Data manipulation |
| `objectUtils.ts` | Object utilities | deepMerge, omit, pick | Data transformation |
| `accessibility.ts` | A11y helpers | Screen reader utils, focus management | Accessibility |
| `responsive.ts` | Responsive design | Screen size, orientation detection | Layout |
| `performanceUtils.ts` | Performance | Measure render time, memory | Monitoring |
| `imageOptimization.ts` | Image utils | Resize, compress, cache | Image handling |
| `hapticFeedback.ts` | Haptics | Trigger haptic feedback | User feedback |
| `offline.ts` | Offline detection | Network status, retry logic | Offline support |
| `networkUtils.ts` | Network utilities | Connection checks, retry | API calls |
| `storageUtils.ts` | Storage | AsyncStorage wrappers, secure storage | Persistence |
| `apiHelpers.ts` | API utilities | Error handling, request formatting | API integration |

**Reusability:** Very High - Prevent duplication of common utilities

---

### Shared Hooks (`src/shared/hooks/`)

| Hook | Purpose | Returns | Usage Pattern |
|------|---------|---------|---------------|
| `useDebounce.ts` | Debounce values | Debounced value | Search inputs |
| `useThrottle.ts` | Throttle callbacks | Throttled function | Scroll handlers |
| `useModal.ts` | Modal state | isOpen, open, close | Modals, dialogs |
| `usePagination.ts` | Pagination logic | page, hasMore, loadMore | Lists |
| `useForm.ts` | Form management | values, errors, handleChange, handleSubmit | Forms |
| `useResource.ts` | Data fetching | data, loading, error, refetch | API resources |
| `useEntityActions.ts` | Entity actions | handleJoin, handleLeave, handleDelete | Match/Team/Tournament |
| `useSort.ts` | Sorting logic | sortedData, sortBy, sortOrder | Sortable lists |
| `useConfirmation.ts` | Confirm dialogs | showConfirmation | Destructive actions |
| `useCelebration.ts` | Celebration animations | showCelebration | Success states |
| `useAnimationConfig.ts` | Animation config | Reanimated config presets | Animations |
| `usePerformance.ts` | Performance tracking | Track screen performance | Monitoring |

**Pattern:** Reusable hooks reduce duplication in screens

**Key Reusable Hook:**
- **`useEntityActions`**: Handles join/leave/delete for Matches, Teams, Tournaments - eliminates code duplication

---

### Shared Contexts (`src/shared/contexts/`)

| Context | Purpose | Provided Values |
|---------|---------|-----------------|
| `AccessibilityContext.tsx` | A11y preferences | Screen reader state, font size, contrast |

**Note:** Theme context is in `src/theme/ThemeContext.tsx`

---

## Navigation Structure

### Navigators (`src/navigation/`)

| Navigator | Type | Screens | Purpose |
|-----------|------|---------|---------|
| `RootNavigator.tsx` | Switch | Auth, Main | Root-level auth check |
| `AuthNavigator.tsx` | Stack | Login, Register, Onboarding | Authentication flow |
| `MainNavigator.tsx` | Bottom Tabs | Matches, Teams, Tournaments, Venues, Profile | Main app navigation |
| `MatchesNavigator.tsx` | Stack | Matches List, Match Detail, Create Match | Match screens |
| `TeamsNavigator.tsx` | Stack | Teams List, Team Detail, Create Team | Team screens |
| `TournamentsNavigator.tsx` | Stack | Tournaments List, Tournament Detail, Create Tournament | Tournament screens |
| `VenuesNavigator.tsx` | Stack | Venues List, Venue Detail, Create Booking | Venue screens |
| `ProfileNavigator.tsx` | Stack | Profile, Edit Profile, Settings, Friends, Change Password | Profile screens |
| `ChatsNavigator.tsx` | Stack | Chats List, Chat Detail | Chat screens |

**Pattern:** Nested navigators with stack navigation inside bottom tabs

**Note:** `routes/index.ts` is empty - route constants not yet implemented

---

## Redundancy Analysis

### Detected Duplications

#### 1. **List Screen Pattern** (HIGH REDUNDANCY)

**Duplicated Across:**
- MatchesScreen.tsx
- TeamsScreen.tsx
- TournamentsScreen.tsx
- VenuesScreen.tsx
- ChatsScreen.tsx
- NotificationsScreen.tsx

**Common Features:**
- FlatList with pagination
- Search bar
- Filter chips
- Pull-to-refresh
- Empty state
- Loading skeleton

**Recommendation:** Already using `ListScreenTemplate` but could be better enforced

#### 2. **Detail Screen Pattern** (HIGH REDUNDANCY)

**Duplicated Across:**
- MatchDetailScreen.tsx
- TeamDetailScreen.tsx
- TournamentDetailScreen.tsx
- VenueDetailScreen.tsx

**Common Features:**
- Header with image
- Participant list
- Join/Leave buttons
- Share button
- Delete button (for owner)
- Status badges

**Current Solution:** `useEntityActions` hook partially addresses this

**Recommendation:** Create `EntityDetailTemplate` to further reduce duplication

#### 3. **Create/Edit Form Pattern** (MEDIUM REDUNDANCY)

**Duplicated Across:**
- CreateMatchScreen.tsx
- CreateTeamScreen.tsx
- CreateTournamentScreen.tsx
- EditProfileScreen.tsx

**Common Features:**
- Form validation (React Hook Form + Yup)
- Image picker
- Date/time pickers
- Sport selector
- Max participants input
- Location picker
- Submit button with loading

**Current Solution:** `FormScreenTemplate` exists but not consistently used

**Recommendation:** Enhance `FormScreenTemplate` with common form fields

#### 4. **Service Layer Pattern** (MEDIUM REDUNDANCY)

**Similar Logic Across:**
- MatchService.ts (224 lines)
- TeamService.ts (similar structure)
- TournamentService.ts (similar structure)
- VenueService.ts (112 lines)

**Common Methods:**
- getAll(filters)
- getById(id)
- create(data)
- update(id, data)
- delete(id)
- Business validation

**Current Solution:** `IService` interface exists

**Recommendation:** Create `BaseService<T>` class with common CRUD logic

#### 5. **Repository Pattern** (LOW REDUNDANCY)

**Already Well Abstracted:**
- All repositories implement `IRepository<T>`
- Consistent CRUD methods
- Centralized API error handling

**Status:** ✅ Good - Minimal duplication

#### 6. **RTK Query Endpoints** (LOW REDUNDANCY)

**Consistent Pattern Across All APIs:**
- Standard CRUD endpoints
- Cache tag invalidation
- Error handling
- Loading states

**Status:** ✅ Good - Consistent pattern

---

### Unused Code Detection

**Findings:**
- `src/navigation/routes/index.ts` - Empty file, route constants not implemented
- `src/store/middleware/index.ts` - No custom middleware implemented
- Dependency Injection Container - Infrastructure exists but underutilized
- **No test files** - Test infrastructure configured but no tests written

---

### Overlapping Functionality

#### 1. **Location Services**

**Locations:**
- `src/features/venues/services/mapService.ts` - Full-featured map utilities
- Potential overlap if location features added to Matches/Tournaments

**Status:** Currently isolated to Venues

**Recommendation:** Move `mapService.ts` to `src/shared/services/` if location features expand

#### 2. **Payment Processing**

**Locations:**
- `src/features/profile/components/PaymentForm.tsx`
- `src/features/profile/services/paymentService.ts`

**Status:** Currently only used for venue bookings

**Recommendation:** Monitor if payments expand to other features (tournament fees, match fees)

#### 3. **Real-time Updates**

**Implementations:**
- `src/shared/services/socketService.ts` - WebSocket infrastructure
- Used in Chat feature
- Potential for Matches, Tournaments

**Status:** Infrastructure centralized, feature usage varies

**Recommendation:** Document socket event naming conventions

---

## Best Practices & Patterns

### Established Patterns to Follow

#### 1. **Feature Module Structure**

**Template:**
```
feature-name/
├── components/      # Feature-specific UI
├── hooks/           # useFeatureScreen.ts pattern
├── screens/         # Screen components
├── services/        # Business logic (Service class)
├── repositories/    # Data access (Repository class)
├── store/           # RTK Query API + slice
└── types/           # TypeScript interfaces
```

**Enforcement:** All 8 features follow this pattern consistently ✅

#### 2. **Barrel Exports**

**Pattern:** Every directory has `index.ts` for clean imports

**Example:**
```typescript
// Instead of:
import { Button } from '../../shared/components/atoms/Button';

// Use:
import { Button } from '@shared/components';
```

**Status:** 73 barrel exports across codebase ✅

#### 3. **Service Layer Pattern**

**Interface:**
```typescript
interface IService {
  initialize(): Promise<void>;
  cleanup(): void;
}
```

**Implementation:**
- Constructor dependency injection
- Business validation before repository calls
- Logging for all operations
- Error transformation

**Status:** Consistently followed ✅

#### 4. **Repository Pattern**

**Interface:**
```typescript
interface IRepository<T> {
  getAll(filters?): Promise<T[]>;
  getById(id): Promise<T>;
  create(data): Promise<T>;
  update(id, data): Promise<T>;
  delete(id): Promise<void>;
}
```

**Status:** Consistently followed ✅

#### 5. **Screen Hook Pattern**

**Convention:** Every screen has a corresponding `use{Screen}Screen.ts` hook

**Example:**
- `MatchesScreen.tsx` → `useMatchesScreen.ts`
- `MatchDetailScreen.tsx` → `useMatchDetailScreen.ts`

**Benefits:**
- Separation of concerns
- Testable business logic
- Reusable logic

**Status:** 100% adoption ✅

#### 6. **RTK Query API Pattern**

**Convention:**
```typescript
export const featureApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({ ... }),
    createItem: builder.mutation<Item, CreateItemRequest>({ ... }),
  }),
});
```

**Cache Tags:** Proper invalidation for optimistic updates

**Status:** Consistently followed ✅

#### 7. **Error Boundary Hierarchy**

**Levels:**
1. `ErrorBoundary` - Root level
2. `FeatureErrorBoundary` - Feature level
3. `ScreenErrorBoundary` - Screen level

**Status:** Infrastructure present ✅

#### 8. **Atomic Design for Components**

**Hierarchy:** Atoms → Molecules → Organisms → Templates

**Status:** Strict adherence ✅

---

### Design Decisions to Respect

#### 1. **No Direct Feature Dependencies**

**Rule:** Features cannot import from other features

**Communication:**
- Via shared services
- Via Redux store
- Via navigation parameters

**Status:** Enforced ✅

#### 2. **TypeScript Strict Mode**

**Rule:** No `any` types, explicit typing required

**Status:** Enforced in tsconfig.json ✅

#### 3. **Redux Toolkit for State**

**Rule:** 
- RTK Query for server state (API calls)
- Redux slices for UI state (filters, selections)
- Redux Persist for offline support

**Status:** Consistently followed ✅

#### 4. **React Hook Form + Yup for Forms**

**Rule:** All forms use React Hook Form with Yup validation schemas

**Status:** Enforced across all create/edit screens ✅

#### 5. **i18next for Localization**

**Rule:** All user-facing strings must be translatable

**Implementation:** `localizationService.ts`

**Status:** Infrastructure ready, adoption varies

---

## Recommendations

### Priority 1: Reduce Code Duplication

#### A. Create Generic Entity Templates

**Action:** Create reusable templates for common patterns

**Templates to Create:**

1. **EntityListScreen Template**
   ```typescript
   // src/shared/components/templates/EntityListScreenTemplate.tsx
   interface EntityListScreenTemplateProps<T> {
     items: T[];
     renderItem: (item: T) => ReactElement;
     onItemPress: (item: T) => void;
     onCreatePress: () => void;
     filters?: FilterConfig[];
     searchPlaceholder?: string;
   }
   ```

2. **EntityDetailScreen Template**
   ```typescript
   // src/shared/components/templates/EntityDetailScreenTemplate.tsx
   interface EntityDetailScreenTemplateProps<T> {
     entity: T;
     imageUrl?: string;
     sections: DetailSection[];
     actions: EntityAction[];
     participants?: User[];
   }
   ```

**Benefit:** Reduce ~500 lines of duplicate code across features

---

#### B. Create BaseService Class

**Action:** Extract common CRUD logic into base class

**Implementation:**
```typescript
// src/core/services/BaseService.ts
export abstract class BaseService<T, TRepository extends IRepository<T>> implements IService {
  constructor(protected repository: TRepository) {}
  
  async getAll(filters?: any): Promise<T[]> {
    return this.repository.getAll(filters);
  }
  
  async getById(id: string): Promise<T> {
    return this.repository.getById(id);
  }
  
  // ... common CRUD methods
  
  // Override in subclasses for custom business logic
  protected abstract validate(data: any): void;
}
```

**Benefit:** Reduce ~300 lines of duplicate service code

---

#### C. Create useEntityList and useEntityDetail Hooks

**Action:** Extract common screen logic into generic hooks

**Implementation:**
```typescript
// src/shared/hooks/useEntityList.ts
export function useEntityList<T>(options: {
  getQuery: any;
  searchFields: string[];
  defaultFilters?: any;
}) { ... }

// src/shared/hooks/useEntityDetail.ts
export function useEntityDetail<T>(options: {
  getQuery: any;
  joinMutation?: any;
  leaveMutation?: any;
  deleteMutation?: any;
}) { ... }
```

**Benefit:** Reduce ~200 lines of duplicate hook code

---

### Priority 2: Improve Architecture

#### A. Move Shared Services Out of Features

**Current Issue:** `mapService.ts` in `features/venues/services/`

**Action:** Move to `src/shared/services/mapService.ts` if used by multiple features

**Benefit:** Better service discovery and reusability

---

#### B. Implement Route Constants

**Current Issue:** `src/navigation/routes/index.ts` is empty

**Action:** Define typed route constants

**Implementation:**
```typescript
// src/navigation/routes/index.ts
export const ROUTES = {
  AUTH: {
    LOGIN: 'Login' as const,
    REGISTER: 'Register' as const,
  },
  MAIN: {
    MATCHES: {
      LIST: 'MatchesList' as const,
      DETAIL: 'MatchDetail' as const,
      CREATE: 'CreateMatch' as const,
    },
    // ... more routes
  },
};

export type RootStackParamList = {
  [ROUTES.AUTH.LOGIN]: undefined;
  [ROUTES.MAIN.MATCHES.DETAIL]: { matchId: string };
  // ... more types
};
```

**Benefit:** Type-safe navigation, prevent typos

---

#### C. Add Test Infrastructure

**Current Issue:** No tests written (0 test files)

**Action:** Add unit tests for critical logic

**Priority:**
1. Service business logic tests
2. Utility function tests
3. Hook tests
4. Component tests

**Start With:**
- `MatchService.test.ts` - Business rule validation
- `dateUtils.test.ts` - Date formatting
- `useEntityActions.test.ts` - Common hook logic

**Benefit:** Prevent regressions, document behavior

---

### Priority 3: Enhance Code Quality

#### A. Add JSDoc Comments to Public APIs

**Current Status:** Some services have JSDoc, inconsistent

**Action:** Add JSDoc to all:
- Service public methods
- Hook return values
- Shared utility functions
- Component props

**Benefit:** Better IDE autocomplete, documentation

---

#### B. Create Storybook for Components

**Action:** Add Storybook for component development

**Benefit:**
- Visual component documentation
- Isolated component testing
- Design system showcase

---

#### C. Add ESLint Rules for Consistency

**Suggested Rules:**
- Enforce barrel imports (`import from '@shared/components'`)
- Prevent feature cross-dependencies
- Require JSDoc for exported functions
- Enforce naming conventions

---

### Priority 4: Performance Optimizations

#### A. Implement Code Splitting

**Action:** Lazy load feature modules

**Implementation:**
```typescript
const MatchesNavigator = React.lazy(() => import('./MatchesNavigator'));
```

**Benefit:** Faster initial load time

---

#### B. Add React.memo to List Items

**Current Issue:** List items re-render unnecessarily

**Action:** Wrap list item components with `React.memo`

**Benefit:** Smoother scrolling performance

---

#### C. Optimize Image Loading

**Current Solution:** `OptimizedImage.tsx` exists

**Action:** Ensure all images use `OptimizedImage` component

**Benefit:** Reduce memory usage, faster loading

---

### Priority 5: Documentation Improvements

#### A. Create API Endpoint Documentation

**Current Issue:** API endpoints scattered across RTK Query files

**Action:** Create centralized API documentation

**Format:**
```markdown
# API Endpoints Reference

## Matches API

### GET /api/matches
Returns list of matches

**Query Parameters:**
- sport?: string
- location?: string
- status?: string

**Response:**
```json
{
  "matches": [...],
  "total": 42
}
```
```

**Benefit:** Easier backend/frontend coordination

---

#### B. Create Component Library Documentation

**Action:** Document all shared components with:
- Purpose
- Props
- Usage examples
- Visual examples

**Tool:** Use Storybook or Docz

---

#### C. Add Architecture Decision Records (ADRs)

**Action:** Document major architectural decisions

**Format:**
```markdown
# ADR-001: Use Feature-Based Architecture

**Status:** Accepted

**Context:** Need scalable folder structure

**Decision:** Organize by features, not technical layers

**Consequences:**
- Pros: Better feature isolation, easier to understand
- Cons: Some code duplication between features
```

---

### Priority 6: Tooling Improvements

#### A. Add Pre-commit Hooks

**Current Status:** Husky installed, lint-staged configured

**Action:** Ensure hooks are working:
- Lint on commit
- Format on commit
- Run relevant tests

**Benefit:** Catch issues before PR

---

#### B. Add CI/CD Pipeline

**Actions:**
- Automated linting
- Automated testing
- Automated builds
- Deploy previews

**Benefit:** Catch issues earlier

---

#### C. Add Bundle Size Monitoring

**Tool:** `react-native-bundle-visualizer`

**Action:** Track bundle size over time

**Benefit:** Prevent bundle bloat

---

## Implementation Checklist

### Quick Wins (1-2 days)

- [ ] Implement route constants (`src/navigation/routes/index.ts`)
- [ ] Move `mapService.ts` to shared if used by multiple features
- [ ] Add JSDoc comments to service public methods
- [ ] Create `.gitignore` for build artifacts
- [ ] Ensure pre-commit hooks are working

### Medium Effort (3-5 days)

- [ ] Create `EntityListScreenTemplate` component
- [ ] Create `EntityDetailScreenTemplate` component
- [ ] Create `useEntityList` hook
- [ ] Create `useEntityDetail` hook
- [ ] Add unit tests for services

### Long-term (1-2 weeks)

- [ ] Create `BaseService<T>` class
- [ ] Refactor services to use `BaseService`
- [ ] Add Storybook for component documentation
- [ ] Create API endpoint documentation
- [ ] Add Architecture Decision Records

---

## Conclusion

The Sportification codebase demonstrates strong architectural principles with:

✅ **Strengths:**
- Feature-based architecture with clear boundaries
- Consistent patterns across features (Repository, Service, Hook)
- Strong type safety with TypeScript
- Atomic design for components
- Centralized state management with Redux Toolkit
- Good separation of concerns

⚠️ **Areas for Improvement:**
- Code duplication in list/detail/form screens (HIGH)
- Missing test coverage (0 tests)
- Inconsistent use of templates
- Underutilized dependency injection
- Missing route constants

🎯 **Key Recommendations:**
1. Create generic entity templates to reduce duplication
2. Implement BaseService class for common CRUD logic
3. Add test coverage for critical paths
4. Document API endpoints
5. Implement route constants for type-safe navigation

**Overall Assessment:** Well-architected codebase with room for optimization through better abstraction and reduced duplication. The foundation is solid for scaling to additional features.

---

**Document Maintenance:**
- Update this document when adding new features
- Review quarterly for redundancy detection
- Keep architecture decisions documented
- Maintain as single source of truth for codebase structure

