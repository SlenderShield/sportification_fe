# Feature Quick Reference Guide

**Purpose:** Quick lookup guide for developers to find existing functionality before implementing new features.

---

## 🔍 Before Adding New Code - Check This First!

### Common Functionality Already Implemented

#### ✅ Authentication & User Management
- [x] Email/password login → `features/auth/services/AuthService.ts`
- [x] User registration → `features/auth/services/AuthService.ts`
- [x] Google Sign-In → `features/auth/services/googleAuthService.ts`
- [x] Apple Sign-In → `features/auth/services/appleAuthService.ts`
- [x] Facebook Login → `features/auth/services/facebookAuthService.ts`
- [x] Biometric auth (Face ID/Touch ID) → `features/auth/services/biometricService.ts`
- [x] Secure token storage → Uses `react-native-keychain`
- [x] User profile CRUD → `features/auth/store/userApi.ts`

#### ✅ List & Detail Screens
- [x] List screen template → `shared/components/templates/ListScreenTemplate.tsx`
- [x] Detail screen template → `shared/components/templates/DetailScreenTemplate.tsx`
- [x] Form screen template → `shared/components/templates/FormScreenTemplate.tsx`
- [x] Empty state template → `shared/components/templates/EmptyScreenTemplate.tsx`

#### ✅ Common UI Components
- [x] Buttons → `shared/components/atoms/Button.tsx`
- [x] Text inputs → `shared/components/atoms/Input.tsx`
- [x] Loading spinners → `shared/components/atoms/LoadingSpinner.tsx`
- [x] Cards → `shared/components/organisms/Card.tsx`
- [x] Modals/Bottom sheets → `shared/components/organisms/BottomSheet.tsx`
- [x] Search bar → `shared/components/molecules/SearchBar.tsx`
- [x] Filter chips → `shared/components/organisms/FilterChips.tsx`
- [x] Date picker → `shared/components/molecules/DatePicker.tsx`
- [x] Time picker → `shared/components/molecules/TimePicker.tsx`

#### ✅ Maps & Location
- [x] Map component → `shared/components/organisms/MapComponent.tsx`
- [x] Location services → `features/venues/services/mapService.ts`
- [x] Distance calculations → `mapService.calculateDistance()`
- [x] Geocoding → `mapService.geocodeAddress()`
- [x] User location → `mapService.getCurrentLocation()`
- [x] Directions → `mapService.getDirections()`

#### ✅ Payments
- [x] Payment form → `features/profile/components/PaymentForm.tsx`
- [x] Stripe integration → `features/profile/services/paymentService.ts`
- [x] Payment intent creation → `features/profile/store/paymentApi.ts`
- [x] Payment confirmation → `features/profile/store/paymentApi.ts`

#### ✅ Real-time Features
- [x] WebSocket client → `shared/services/socketService.ts`
- [x] Chat messaging → `features/chat/services/ChatService.ts`
- [x] Real-time updates → Socket.IO integration

#### ✅ Push Notifications
- [x] Firebase Cloud Messaging → `shared/services/notificationService.ts`
- [x] Local notifications → Uses `@notifee/react-native`
- [x] Notification permissions → `notificationService.requestPermission()`
- [x] Notification handling → `notificationService.onNotification()`

#### ✅ Form Handling
- [x] Form validation → Uses `react-hook-form` + `yup`
- [x] Form hook → `shared/hooks/useForm.ts`
- [x] Form helpers → `shared/helpers/formHelpers.ts`

#### ✅ Data Fetching
- [x] RTK Query APIs → All features have API files
- [x] Resource hook → `shared/hooks/useResource.ts`
- [x] Pagination → `shared/hooks/usePagination.ts`
- [x] Infinite scroll → Built into `usePagination`

#### ✅ State Management
- [x] Redux store → `store/index.ts`
- [x] Typed hooks → `store/hooks.ts` (`useAppDispatch`, `useAppSelector`)
- [x] Redux Persist → Configured for offline support
- [x] RTK Query caching → Automatic caching with cache tags

#### ✅ Utilities
- [x] Date formatting → `shared/utils/dateUtils.ts`
- [x] Currency formatting → `shared/utils/formatUtils.ts`
- [x] Validation → `shared/utils/validation.ts`
- [x] String manipulation → `shared/utils/stringUtils.ts`
- [x] Array utilities → `shared/utils/arrayUtils.ts`
- [x] Object utilities → `shared/utils/objectUtils.ts`
- [x] Accessibility helpers → `shared/utils/accessibility.ts`
- [x] Responsive design → `shared/utils/responsive.ts`
- [x] Haptic feedback → `shared/utils/hapticFeedback.ts`
- [x] Image optimization → `shared/utils/imageOptimization.ts`
- [x] Network detection → `shared/utils/networkUtils.ts`
- [x] Offline support → `shared/utils/offline.ts`

#### ✅ Analytics & Monitoring
- [x] Firebase Analytics → `shared/services/analyticsService.ts`
- [x] Crashlytics → Firebase integration
- [x] Performance monitoring → `shared/utils/performanceUtils.ts`
- [x] Error boundaries → `shared/components/organisms/ErrorBoundary.tsx`

#### ✅ Internationalization
- [x] i18n setup → `shared/services/localizationService.ts`
- [x] Language switching → `localizationService.changeLanguage()`
- [x] Translations → Uses `i18next`

#### ✅ Common Patterns
- [x] Entity actions (join/leave/delete) → `shared/hooks/useEntityActions.ts`
- [x] Confirmation dialogs → `shared/hooks/useConfirmation.ts`
- [x] Debounce → `shared/hooks/useDebounce.ts`
- [x] Throttle → `shared/hooks/useThrottle.ts`
- [x] Modal state → `shared/hooks/useModal.ts`
- [x] Sort logic → `shared/hooks/useSort.ts`

---

## 📦 Feature Capabilities

### Matches Feature
**What it does:** Match creation, browsing, joining, score tracking

**Key capabilities:**
- ✅ List matches with filters (sport, location, status)
- ✅ View match details
- ✅ Create new matches
- ✅ Join/leave matches with validation
- ✅ Update match scores
- ✅ AI-powered recommendations
- ✅ Real-time updates via Socket.IO

**When to use:**
- Creating any "event" or "activity" system
- Need join/leave functionality
- Need participant management

**Files:** `src/features/matches/`

---

### Teams Feature
**What it does:** Team management and member coordination

**Key capabilities:**
- ✅ List teams with filters
- ✅ View team details and members
- ✅ Create new teams
- ✅ Join/leave teams
- ✅ Manage team members (if owner)
- ✅ Team-based activities

**When to use:**
- Creating groups or organizations
- Need member management
- Need hierarchical permissions (owner vs member)

**Files:** `src/features/teams/`

---

### Tournaments Feature
**What it does:** Tournament organization with brackets and standings

**Key capabilities:**
- ✅ List tournaments
- ✅ View tournament brackets
- ✅ View standings and rankings
- ✅ Create tournaments
- ✅ Join/leave tournaments
- ✅ Multi-round competitions
- ✅ Bracket generation

**When to use:**
- Creating competitive events
- Need bracket/playoff systems
- Need ranking/standing calculations

**Files:** `src/features/tournaments/`

---

### Venues Feature
**What it does:** Venue discovery and booking with payments

**Key capabilities:**
- ✅ List venues with map view
- ✅ Location-based search
- ✅ Distance filtering
- ✅ Venue details with images
- ✅ Book venues with Stripe payment
- ✅ View booking history
- ✅ Get directions to venue

**When to use:**
- Any location-based service
- Need booking/reservation system
- Need payment processing

**Files:** `src/features/venues/`

---

### Chat Feature
**What it does:** Real-time messaging

**Key capabilities:**
- ✅ List conversations
- ✅ Send/receive messages in real-time
- ✅ Read/unread status
- ✅ Typing indicators
- ✅ Group chat support

**When to use:**
- Adding messaging to any feature
- Need real-time communication
- Need conversation threads

**Files:** `src/features/chat/`

---

### Profile Feature
**What it does:** User profiles, settings, friends, payments

**Key capabilities:**
- ✅ View/edit user profile
- ✅ Change password
- ✅ App settings (theme, notifications, language)
- ✅ Accessibility settings
- ✅ Friends management (search, add, remove)
- ✅ Payment method management
- ✅ Biometric authentication setup

**When to use:**
- User preferences and settings
- Social features (friends, followers)
- Payment management

**Files:** `src/features/profile/`

---

### Notifications Feature
**What it does:** Push and in-app notifications

**Key capabilities:**
- ✅ List notifications
- ✅ Mark as read/unread
- ✅ Delete notifications
- ✅ Push notification handling
- ✅ Notification permissions
- ✅ Notification categories

**When to use:**
- Need to notify users of events
- Alert users to actions
- Real-time alerts

**Files:** `src/features/notifications/`

---

## 🛠️ How to Add a New Feature

### Step 1: Check for Similar Features
Before creating a new feature, review:
1. **CODEBASE_INDEX.md** - Full feature documentation
2. This file - Quick capabilities lookup
3. Existing features with similar patterns

### Step 2: Create Feature Structure

```bash
src/features/new-feature/
├── components/      # Feature-specific UI components
├── hooks/           # useNewFeatureScreen.ts, etc.
├── screens/         # Screen components
├── services/        # Business logic (Service class)
├── repositories/    # Data access (Repository class)
├── store/           # RTK Query API + Redux slice
├── types/           # TypeScript interfaces
└── index.ts         # Barrel export
```

### Step 3: Follow Established Patterns

**Service Layer:**
```typescript
// services/NewFeatureService.ts
export class NewFeatureService implements IService {
  constructor(private repository: NewFeatureRepository) {}
  
  async initialize(): Promise<void> { ... }
  cleanup(): void { ... }
  
  // Business methods with validation
  async create(data: CreateRequest): Promise<Item> {
    // Validate business rules
    if (!data.name || data.name.length < 3) {
      throw new ValidationError('Name too short');
    }
    
    // Call repository
    const item = await this.repository.create(data);
    
    // Log action
    logger.info('Item created', { id: item.id });
    
    return item;
  }
}
```

**Repository Layer:**
```typescript
// repositories/NewFeatureRepository.ts
export class NewFeatureRepository implements IRepository<Item> {
  async getAll(filters?: any): Promise<Item[]> {
    const response = await api.get('/api/items', { params: filters });
    return response.data;
  }
  
  async getById(id: string): Promise<Item> {
    const response = await api.get(`/api/items/${id}`);
    return response.data;
  }
  
  async create(data: CreateRequest): Promise<Item> {
    const response = await api.post('/api/items', data);
    return response.data;
  }
}
```

**RTK Query API:**
```typescript
// store/newFeatureApi.ts
export const newFeatureApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      query: () => '/api/items',
      providesTags: ['Item'],
    }),
    createItem: builder.mutation<Item, CreateItemRequest>({
      query: (data) => ({
        url: '/api/items',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Item'],
    }),
  }),
});
```

**Screen Hook:**
```typescript
// hooks/useNewFeatureScreen.ts
export const useNewFeatureScreen = () => {
  const navigation = useNavigation();
  const { data: items, isLoading, refetch } = useGetItemsQuery();
  
  const handleItemPress = (item: Item) => {
    navigation.navigate('ItemDetail', { itemId: item.id });
  };
  
  return {
    items,
    isLoading,
    refetch,
    handleItemPress,
  };
};
```

**Screen Component:**
```typescript
// screens/NewFeatureScreen.tsx
export const NewFeatureScreen: React.FC = () => {
  const { items, isLoading, refetch, handleItemPress } = useNewFeatureScreen();
  
  return (
    <ListScreenTemplate
      data={items}
      loading={isLoading}
      onRefresh={refetch}
      renderItem={(item) => (
        <Card onPress={() => handleItemPress(item)}>
          <Text>{item.name}</Text>
        </Card>
      )}
    />
  );
};
```

### Step 4: Reuse Existing Components

**Don't create new components for:**
- Buttons → Use `Button` atom
- Text inputs → Use `Input` atom
- Lists → Use `ListScreenTemplate`
- Cards → Use `Card` organism
- Modals → Use `BottomSheet` organism
- Search → Use `SearchBar` molecule
- Filters → Use `FilterChips` organism

**Create feature components only for:**
- Domain-specific UI (match brackets, tournament standings)
- Complex feature-specific interactions
- Feature-specific data visualization

### Step 5: Add to Navigation

```typescript
// navigation/NewFeatureNavigator.tsx
export const NewFeatureNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NewFeatureList" component={NewFeatureScreen} />
      <Stack.Screen name="NewFeatureDetail" component={NewFeatureDetailScreen} />
    </Stack.Navigator>
  );
};
```

---

## 🚫 Anti-Patterns to Avoid

### ❌ Don't Create Duplicate Utilities

**Before creating a utility function, check:**
- `shared/utils/` - 15+ utility files
- `shared/helpers/` - Helper functions
- Feature-specific utils

**Example:**
```typescript
// ❌ DON'T create duplicate date formatting
export const formatDate = (date: Date) => { ... }

// ✅ DO use existing utility
import { formatDate } from '@shared/utils/dateUtils';
```

### ❌ Don't Create Duplicate Components

**Before creating a component, check:**
- Atomic design hierarchy (atoms → molecules → organisms)
- Existing shared components
- Templates

**Example:**
```typescript
// ❌ DON'T create custom search bar
export const MySearchBar = () => { ... }

// ✅ DO use existing component
import { SearchBar } from '@shared/components/molecules';
```

### ❌ Don't Bypass Architecture Layers

**Wrong:**
```typescript
// ❌ DON'T call API directly from screen
const response = await axios.get('/api/items');
```

**Correct:**
```typescript
// ✅ DO use RTK Query
const { data: items } = useGetItemsQuery();

// ✅ OR use service layer
const items = await itemService.getAll();
```

### ❌ Don't Create Feature Dependencies

**Wrong:**
```typescript
// ❌ DON'T import from other features
import { MatchService } from '@features/matches/services';
```

**Correct:**
```typescript
// ✅ DO communicate via shared services or Redux
const dispatch = useAppDispatch();
dispatch(sharedAction());

// ✅ OR use shared services
import { apiClient } from '@shared/services';
```

### ❌ Don't Use `any` Type

**Wrong:**
```typescript
// ❌ DON'T use any
function processData(data: any) { ... }
```

**Correct:**
```typescript
// ✅ DO use proper types
interface DataInput {
  id: string;
  name: string;
}

function processData(data: DataInput) { ... }

// ✅ OR use unknown for truly unknown types
function handleError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}
```

---

## 🔧 Common Tasks Quick Guide

### Adding a New Screen

1. Create screen component in feature's `screens/` folder
2. Create hook in feature's `hooks/` folder (e.g., `useNewScreen.ts`)
3. Add screen to navigator
4. Use template component (`ListScreenTemplate`, `DetailScreenTemplate`, etc.)

### Adding Form Validation

```typescript
import { useForm } from '@shared/hooks';
import { object, string } from 'yup';

const schema = object({
  name: string().required('Name is required').min(3),
  email: string().email('Invalid email').required(),
});

const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: { name: '', email: '' },
  validationSchema: schema,
  onSubmit: async (values) => {
    // Handle submission
  },
});
```

### Adding Real-time Updates

```typescript
import { socketService } from '@shared/services';

useEffect(() => {
  socketService.on('item:created', (data) => {
    // Handle real-time update
    queryClient.invalidateQueries(['items']);
  });
  
  return () => {
    socketService.off('item:created');
  };
}, []);
```

### Adding Map to Screen

```typescript
import { MapComponent } from '@shared/components/organisms';

<MapComponent
  markers={[{
    id: '1',
    coordinate: { latitude: 37.78, longitude: -122.4 },
    title: 'Location',
  }]}
  showUserLocation
  onMarkerPress={(id) => console.log('Marker:', id)}
/>
```

### Adding Payment Processing

```typescript
import { PaymentForm } from '@features/profile/components';
import { useCreatePaymentIntentMutation } from '@features/profile/store/paymentApi';

const [createIntent] = useCreatePaymentIntentMutation();

const handlePay = async () => {
  const { clientSecret } = await createIntent({
    amount: 5000, // $50 in cents
    currency: 'USD',
  }).unwrap();
  
  // Show payment form with clientSecret
};
```

### Adding Notification

```typescript
import { notificationService } from '@shared/services';

await notificationService.showNotification({
  title: 'Match Started',
  body: 'Your match has begun!',
  data: { matchId: '123' },
});
```

### Adding Analytics Event

```typescript
import { analyticsService } from '@shared/services';

analyticsService.trackEvent('match_created', {
  sport: 'soccer',
  participants: 10,
});
```

---

## 📚 Key Documentation Files

- **CODEBASE_INDEX.md** - Complete feature mapping and architecture guide
- **ARCHITECTURE.md** - Architecture principles and patterns
- **CODING_STANDARDS.md** - Code quality guidelines
- **COMPONENT_GUIDELINES.md** - Component creation guidelines
- **V2_FEATURES.md** - V2 features documentation
- **CONTRIBUTING.md** - Contribution workflow
- **REFACTORING_GUIDE.md** - Refactoring guidelines

---

## 🎯 Development Workflow

1. **Before coding:**
   - Check CODEBASE_INDEX.md for existing functionality
   - Check this file for quick capability lookup
   - Review similar features for patterns

2. **During development:**
   - Follow established patterns
   - Reuse existing components and utilities
   - Write self-documenting code
   - Add JSDoc for public APIs

3. **After coding:**
   - Test your changes
   - Update documentation if needed
   - Ensure code follows standards
   - Run linter and fix issues

---

## 🤝 Need Help?

1. Check **CODEBASE_INDEX.md** for comprehensive documentation
2. Review existing feature implementations
3. Look for similar patterns in the codebase
4. Follow the established architecture

---

**Last Updated:** October 28, 2025  
**Maintainer:** Keep this document updated when adding new features or capabilities
