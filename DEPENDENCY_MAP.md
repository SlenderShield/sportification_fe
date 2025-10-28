# Module Dependency Map

**Purpose:** Visual representation of dependencies between modules to understand coupling and prevent circular dependencies.

---

## Dependency Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│                         (App.tsx)                            │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Navigation Layer                         │
│  RootNavigator → AuthNavigator / MainNavigator              │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Feature Layer                           │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │  Auth  │ │Matches │ │ Teams  │ │Tourna  │ │ Venues │   │
│  └────────┘ └────────┘ └────────┘ └─ments─┘ └────────┘   │
│  ┌────────┐ ┌────────┐ ┌────────┐                          │
│  │  Chat  │ │Profile │ │ Notif  │                          │
│  └────────┘ └────────┘ └────────┘                          │
└───────────────────────────────┬─────────────────────────────┘
                                │
                   ┌────────────┴────────────┐
                   ▼                         ▼
    ┌───────────────────────┐   ┌───────────────────────┐
    │    Shared Layer       │   │     Core Layer        │
    │  Components, Hooks,   │   │   Config, Types,      │
    │  Utils, Services      │   │   Constants, DI       │
    └───────────────────────┘   └───────────────────────┘
                   │                         │
                   └────────────┬────────────┘
                                ▼
                   ┌───────────────────────┐
                   │   External Layer      │
                   │  React Native, Redux, │
                   │  Firebase, Stripe     │
                   └───────────────────────┘
```

---

## Feature-Level Dependencies

### Auth Feature

**Depends on:**
- ✅ Core (config, types, errors)
- ✅ Shared (components, services, utils)
- ✅ External (Firebase, Google/Apple/Facebook SDKs, Keychain, Biometrics)

**Used by:**
- ✅ ALL features (for authenticated requests)
- ✅ Navigation (auth state routing)

**Dependency Score:** 🔴 Critical (foundation for all features)

**Services:**
```
AuthService
    ├── AuthRepository
    │   └── API Client (shared/services/api.ts)
    ├── BiometricService
    │   └── react-native-biometrics
    ├── GoogleAuthService
    │   └── @react-native-google-signin/google-signin
    ├── AppleAuthService
    │   └── @invertase/react-native-apple-authentication
    └── FacebookAuthService
        └── react-native-fbsdk-next
```

---

### Matches Feature

**Depends on:**
- ✅ Core (config, types, errors)
- ✅ Shared (components, hooks, services, utils)
- ✅ Auth (user authentication)
- ✅ External (Socket.IO for real-time updates)

**Used by:**
- ⚠️ Tournaments (tournaments contain matches)
- ⚠️ Chat (match-based conversations)

**Dependency Score:** 🟡 Medium (shared patterns with Teams/Tournaments)

**Services:**
```
MatchService
    ├── MatchRepository
    │   └── Match API (RTK Query)
    ├── RecommendationAPI (AI recommendations)
    └── SocketService (shared)
        └── socket.io-client
```

**Shared Patterns:**
- Uses `useEntityActions` hook for join/leave/delete
- Uses templates from shared/components
- Uses common validation from shared/utils

---

### Teams Feature

**Depends on:**
- ✅ Core (config, types, errors)
- ✅ Shared (components, hooks, services, utils)
- ✅ Auth (user authentication)

**Used by:**
- ⚠️ Matches (team-based matches)
- ⚠️ Tournaments (team-based tournaments)

**Dependency Score:** 🟡 Medium (similar to Matches)

**Services:**
```
TeamService
    └── TeamRepository
        └── Team API (RTK Query)
```

**Shared Patterns:**
- 🔄 VERY similar to Matches (potential for abstraction)
- Uses `useEntityActions` hook
- Uses templates from shared/components

---

### Tournaments Feature

**Depends on:**
- ✅ Core (config, types, errors)
- ✅ Shared (components, hooks, services, utils)
- ✅ Auth (user authentication)
- ⚠️ Matches (tournaments contain matches - implicit)

**Used by:**
- ⚠️ Chat (tournament-based conversations)

**Dependency Score:** 🟡 Medium (depends on Match patterns)

**Services:**
```
TournamentService
    └── TournamentRepository
        └── Tournament API (RTK Query)
```

**Unique Features:**
- Bracket generation
- Standing calculations
- Multi-round logic

**Shared Patterns:**
- Uses `useEntityActions` hook
- Similar screen structure to Matches/Teams

---

### Venues Feature

**Depends on:**
- ✅ Core (config, types, errors)
- ✅ Shared (components, hooks, services, utils)
- ✅ Auth (user authentication)
- ✅ Profile (payment processing - implicit)
- ✅ External (Google Maps, Stripe, Geolocation)

**Used by:**
- ⚠️ Matches (venue location for matches)
- ⚠️ Tournaments (venue for tournaments)

**Dependency Score:** 🟢 Low (unique domain logic)

**Services:**
```
VenueService
    ├── VenueRepository
    │   └── Venue API (RTK Query)
    ├── MapService
    │   ├── react-native-maps
    │   ├── @react-native-community/geolocation
    │   └── GOOGLE_MAPS_API_KEY
    └── PaymentService (from Profile)
        └── @stripe/stripe-react-native
```

**Unique Components:**
- MapComponent (shared organism, but primarily used here)
- Location-based filtering
- Payment integration

---

### Chat Feature

**Depends on:**
- ✅ Core (config, types, errors)
- ✅ Shared (components, hooks, services, utils)
- ✅ Auth (user authentication)
- ✅ External (Socket.IO)

**Used by:**
- ⚠️ Matches (match chat)
- ⚠️ Teams (team chat)
- ⚠️ Tournaments (tournament chat)

**Dependency Score:** 🟢 Low (self-contained)

**Services:**
```
ChatService
    ├── ChatRepository
    │   └── Chat API (RTK Query)
    └── SocketService (shared)
        └── socket.io-client (real-time messaging)
```

**Real-time Events:**
- `message:sent`
- `message:received`
- `user:typing`
- `message:read`

---

### Profile Feature

**Depends on:**
- ✅ Core (config, types, errors)
- ✅ Shared (components, hooks, services, utils)
- ✅ Auth (user data)
- ✅ External (Stripe, Biometrics)

**Used by:**
- ✅ ALL features (user profile display)
- ⚠️ Venues (payment processing)

**Dependency Score:** 🔴 High (payment used by other features)

**Services:**
```
ProfileService
    ├── ProfileRepository
    │   └── Profile API (RTK Query)
    ├── PaymentService
    │   ├── @stripe/stripe-react-native
    │   └── Payment API (RTK Query)
    └── BiometricService (from Auth)
```

**Reusable Components:**
- PaymentForm.tsx (could be moved to shared if used elsewhere)
- Payment processing logic

---

### Notifications Feature

**Depends on:**
- ✅ Core (config, types, errors)
- ✅ Shared (components, hooks, services, utils)
- ✅ Auth (user authentication)
- ✅ External (Firebase Cloud Messaging, Notifee)

**Used by:**
- ✅ ALL features (notification triggers)

**Dependency Score:** 🔴 High (used by all features)

**Services:**
```
NotificationService (shared)
    ├── @react-native-firebase/messaging (FCM)
    ├── @notifee/react-native (local notifications)
    └── Notification API (RTK Query)
```

**Integration Points:**
- Match created/updated → notification
- Team invite → notification
- Tournament start → notification
- Chat message → notification

---

## Shared Module Dependencies

### Components

**Atoms:**
- ✅ React Native core components
- ✅ Theme system (`src/theme/`)
- ✅ No feature dependencies

**Molecules:**
- ✅ Atoms
- ✅ Shared hooks (useDebounce, etc.)
- ✅ Shared utils

**Organisms:**
- ✅ Atoms + Molecules
- ✅ Shared services (for MapComponent, ErrorBoundary, etc.)
- ✅ External libraries (react-native-maps, Lottie, etc.)

**Templates:**
- ✅ Organisms + Molecules + Atoms
- ✅ Shared hooks
- ✅ Layout logic

**Dependency Flow:**
```
Templates
    ├── Organisms
    │   ├── Molecules
    │   │   └── Atoms
    │   │       └── React Native + Theme
    │   └── Shared Services
    └── Shared Hooks
```

---

### Services

**API Client (`shared/services/api.ts`):**
- ✅ axios
- ✅ Auth store (for token injection)
- ✅ Core config (API_BASE_URL)
- 🔴 **Used by ALL features**

**Socket Service (`shared/services/socketService.ts`):**
- ✅ socket.io-client
- ✅ Auth store (for authentication)
- ✅ Core config (SOCKET_URL)
- 🟡 **Used by: Chat, potentially Matches/Tournaments for real-time updates**

**Analytics Service (`shared/services/analyticsService.ts`):**
- ✅ Firebase Analytics
- ✅ Firebase Crashlytics
- 🔴 **Used by ALL features**

**Notification Service (`shared/services/notificationService.ts`):**
- ✅ Firebase Cloud Messaging
- ✅ Notifee
- ✅ Notification API
- 🔴 **Used by ALL features**

**Localization Service (`shared/services/localizationService.ts`):**
- ✅ i18next
- ✅ react-i18next
- 🔴 **Used by ALL features**

---

### Hooks

**useEntityActions:**
- ✅ useConfirmation hook
- ✅ Navigation
- 🟡 **Used by: Matches, Teams, Tournaments detail screens**

**useResource:**
- ✅ React Query / RTK Query
- 🟡 **Alternative data fetching pattern (less used)**

**usePagination:**
- ✅ useState, useEffect
- 🟢 **Used by: List screens for pagination**

**useDebounce / useThrottle:**
- ✅ React hooks only
- 🟢 **Used by: Search inputs, scroll handlers**

**useForm:**
- ✅ react-hook-form
- ✅ yup
- 🟡 **Alternative to direct react-hook-form usage**

---

### Utils

**All utils are dependency-free (pure functions) except:**
- `imageOptimization.ts` → React Native Image, AsyncStorage
- `responsive.ts` → React Native Dimensions
- `accessibility.ts` → React Native AccessibilityInfo
- `hapticFeedback.ts` → react-native-haptic-feedback
- `offline.ts` → NetInfo
- `networkUtils.ts` → NetInfo
- `storageUtils.ts` → AsyncStorage, react-native-keychain

---

## Core Module Dependencies

### Config
- ✅ Environment variables (react-native-dotenv)
- ✅ No other dependencies
- 🔴 **Used by ALL features**

### Constants
- ✅ No dependencies
- 🔴 **Used by ALL features**

### Types
- ✅ TypeScript only
- 🔴 **Used by ALL features**

### Dependency Injection Container
- ✅ No dependencies (pure IoC implementation)
- ⚠️ **Under-utilized**

### Errors
- ✅ No dependencies
- 🔴 **Used by ALL features**

---

## External Dependencies Map

### Critical (Cannot Remove)

**React Native Ecosystem:**
- `react` (19.1.1)
- `react-native` (0.81.2)
- `react-native-safe-area-context`
- `react-native-screens`

**Navigation:**
- `@react-navigation/native`
- `@react-navigation/stack`
- `@react-navigation/bottom-tabs`

**State Management:**
- `@reduxjs/toolkit`
- `react-redux`
- `redux-persist`
- `reselect`

**Networking:**
- `axios` (API calls)
- `socket.io-client` (real-time)

---

### Feature-Specific (Can Remove if Feature Removed)

**Authentication:**
- `@react-native-google-signin/google-signin`
- `@invertase/react-native-apple-authentication`
- `react-native-fbsdk-next`
- `react-native-biometrics`
- `react-native-keychain`

**Maps & Location:**
- `react-native-maps`
- `@react-native-community/geolocation`

**Payments:**
- `@stripe/stripe-react-native`

**Firebase:**
- `@react-native-firebase/app`
- `@react-native-firebase/analytics`
- `@react-native-firebase/crashlytics`
- `@react-native-firebase/messaging`

**Notifications:**
- `@notifee/react-native`

**Forms:**
- `react-hook-form`
- `@hookform/resolvers`
- `yup`

**UI/UX:**
- `lottie-react-native` (animations)
- `react-native-reanimated` (animations)
- `react-native-gesture-handler` (gestures)
- `react-native-haptic-feedback` (haptics)
- `@expo/vector-icons` (icons)
- `react-native-vector-icons` (icons)

**Internationalization:**
- `i18next`
- `react-i18next`

**Utilities:**
- `date-fns` (date manipulation)
- `@react-native-async-storage/async-storage` (storage)

---

## Circular Dependency Check

### ✅ No Circular Dependencies Detected

**Reason:** Feature-based architecture prevents circular dependencies by enforcing:
1. Features cannot import from other features
2. Shared module is dependency-free from features
3. Core module is dependency-free from features and shared

**Architecture Rule:**
```
Features → Shared → Core → External
     ↓         ↓       ↓
  (No backward dependencies allowed)
```

---

## Coupling Analysis

### High Coupling (Acceptable)

**All Features → Auth:**
- ✅ Acceptable: Authentication is foundational
- ✅ Decoupled via Redux store (no direct imports)

**All Features → Shared Services:**
- ✅ Acceptable: Shared infrastructure
- ✅ Well-abstracted interfaces

**All Features → Core:**
- ✅ Acceptable: Core types and config
- ✅ Minimal coupling

---

### Medium Coupling (Monitor)

**Venues → Profile (Payment):**
- ⚠️ Payment logic in Profile feature
- 💡 **Consider:** Move payment to shared if other features need it

**Tournaments → Matches:**
- ⚠️ Implicit dependency (tournaments contain matches)
- 💡 **Consider:** Explicit interface or shared types

**Multiple Features → MapService:**
- ⚠️ Currently in `features/venues/services/`
- 💡 **Consider:** Move to `shared/services/` if used by Matches/Tournaments

---

### Low Coupling (Good)

**Chat Feature:**
- ✅ Self-contained
- ✅ Only depends on shared services

**Notification Feature:**
- ✅ Self-contained
- ✅ Clean integration points

---

## Dependency Injection Usage

### Current State: Under-utilized

**Infrastructure Exists:**
- ✅ `Container.ts` - IoC container implementation
- ✅ `ContainerProvider.tsx` - React context
- ✅ Service interfaces (`IService`, `IRepository`)

**Actual Usage:**
- ⚠️ Most services use direct instantiation
- ⚠️ Container not widely used in features

**Example of Direct Instantiation:**
```typescript
// Current pattern (not using DI)
export const matchService = new MatchService(new MatchRepository());
```

**Recommended Pattern:**
```typescript
// Better: Use DI container
const container = useContainer();
const matchService = container.resolve<IMatchService>('MatchService');
```

---

## Recommendations

### Priority 1: Decouple Payment Logic

**Issue:** Payment in Profile feature, but used by Venues

**Action:**
1. Move `PaymentService` to `shared/services/`
2. Move `PaymentForm` to `shared/components/organisms/`
3. Move `paymentApi` to shared store or keep as feature API

**Benefit:** Reusable for future features (tournament fees, match fees)

---

### Priority 2: Centralize Location Services

**Issue:** `mapService.ts` in `features/venues/services/`

**Action:**
1. Evaluate if Matches/Tournaments need location features
2. If yes, move `mapService.ts` to `shared/services/`
3. Keep `MapComponent` in shared (already done ✅)

**Benefit:** Consistent location handling across features

---

### Priority 3: Abstract Common Entity Logic

**Issue:** Matches, Teams, Tournaments have similar structures

**Action:**
1. Create `BaseEntityService<T>` in core
2. Create `EntityDetailTemplate` in shared
3. Create `useEntityList` and `useEntityDetail` hooks

**Benefit:** Reduce 500+ lines of duplicate code

---

### Priority 4: Increase DI Container Usage

**Issue:** DI infrastructure exists but under-utilized

**Action:**
1. Register all services in container
2. Use container for service resolution
3. Enable easier testing and mocking

**Benefit:** Better testability, looser coupling

---

### Priority 5: Document Cross-Feature Dependencies

**Issue:** Implicit dependencies (Tournaments → Matches)

**Action:**
1. Make dependencies explicit in types
2. Document integration points
3. Consider event-based communication for loose coupling

**Benefit:** Clearer architecture, easier refactoring

---

## Dependency Health Score

| Category | Score | Status |
|----------|-------|--------|
| Architecture | 9/10 | ✅ Excellent |
| Circular Dependencies | 10/10 | ✅ None detected |
| Feature Coupling | 8/10 | ✅ Good |
| Shared Reusability | 9/10 | ✅ Excellent |
| DI Usage | 5/10 | ⚠️ Under-utilized |
| External Dependencies | 8/10 | ✅ Well-managed |
| Overall | 8.2/10 | ✅ Very Good |

---

**Strengths:**
- ✅ Feature-based architecture prevents circular dependencies
- ✅ Clean separation of concerns
- ✅ Well-organized shared resources
- ✅ Consistent patterns across features

**Areas for Improvement:**
- ⚠️ Increase DI container usage
- ⚠️ Move cross-feature utilities to shared
- ⚠️ Make implicit dependencies explicit
- ⚠️ Abstract common entity patterns

---

**Maintenance Note:** Review this document quarterly to identify new dependencies and coupling issues.

**Last Updated:** October 28, 2025
