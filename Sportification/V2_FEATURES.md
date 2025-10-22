# Sportification V2.0 Features

This document outlines the new features added in V2.0 of the Sportification mobile app.

## New Features Overview

### 1. Maps Integration 🗺️

**Purpose**: Provide location-aware experiences for matches, tournaments, and venues.

**Implementation**:
- `react-native-maps` for native map components
- `@react-native-community/geolocation` for location services
- `MapService` for location utilities and distance calculations

**Components**:
- `MapComponent`: Reusable map view with marker support
- Integrated into venue discovery, match listings, and tournament details

**Usage**:
```typescript
import MapComponent from '../components/map/MapComponent';

<MapComponent
  markers={[{
    id: '1',
    coordinate: { latitude: 37.78, longitude: -122.4 },
    title: 'Match Location',
    description: 'Soccer match at Golden Gate Park'
  }]}
  showUserLocation
  showDirectionsButton
  onMarkerPress={(id) => console.log('Marker pressed:', id)}
/>
```

**Features**:
- Show nearby matches/venues based on user location
- Get directions to venue/match location
- Distance-based search and filtering
- Map clustering for venue markers
- Real-time location updates

---

### 2. Payment Integration 💳

**Purpose**: Enable secure in-app payments for venue bookings.

**Implementation**:
- `@stripe/stripe-react-native` for payment processing
- PCI-compliant payment handling
- Support for credit/debit cards

**Components**:
- `PaymentForm`: Card input and payment confirmation
- `PaymentService`: Stripe initialization and utilities

**API Endpoints**:
- `POST /api/v2/payments/create-intent` - Create payment intent
- `POST /api/v2/payments/confirm` - Confirm payment
- `GET /api/v2/payments/history` - Get payment history
- `POST /api/v2/payments/refund` - Request refund

**Usage**:
```typescript
import PaymentForm from '../components/payment/PaymentForm';
import { useCreatePaymentIntentMutation } from '../store/api/paymentApi';

const [createIntent] = useCreatePaymentIntentMutation();

// Create payment intent
const { clientSecret } = await createIntent({
  amount: 5000, // $50.00 in cents
  currency: 'USD',
  bookingId: 'booking-123'
}).unwrap();

// Show payment form
<PaymentForm
  amount={5000}
  clientSecret={clientSecret}
  onPaymentSuccess={(intentId) => console.log('Success:', intentId)}
  onPaymentError={(error) => console.log('Error:', error)}
/>
```

---

### 3. Biometric Authentication 🔐

**Purpose**: Quick and secure login using Face ID / Touch ID.

**Implementation**:
- `react-native-biometrics` for biometric authentication
- Secure credential storage
- Fallback to device credentials

**Service**:
- `BiometricService`: Check availability, authenticate, manage keys

**Usage**:
```typescript
import { biometricService } from '../services/biometricService';

// Check if biometrics available
const { available, biometryType } = await biometricService.checkAvailability();

// Authenticate user
if (available) {
  const success = await biometricService.authenticate('Login to Sportification');
  if (success) {
    // Proceed with login
  }
}
```

---

### 4. Localization 🌐

**Purpose**: Multi-language support for global reach.

**Implementation**:
- `i18next` and `react-i18next` for translations
- Current languages: English, Hindi
- RTL support ready for Arabic expansion

**Service**:
- `LocalizationService`: Language switching and persistence

**Usage**:
```typescript
import { useTranslation } from 'react-i18next';
import { localizationService } from '../services/localizationService';

// In component
const { t } = useTranslation();
<Text>{t('matches.title')}</Text>

// Change language
await localizationService.changeLanguage('hi'); // Switch to Hindi
```

**Translation Keys**:
- `common.*` - Common UI elements
- `auth.*` - Authentication screens
- `matches.*` - Match-related screens
- `tournaments.*` - Tournament features
- `teams.*` - Team management
- `venues.*` - Venue and booking
- `chat.*` - Messaging
- `payments.*` - Payment flows
- `profile.*` - User profile
- `notifications.*` - Notifications
- `errors.*` - Error messages

---

### 5. AI-Powered Recommendations 🧠

**Purpose**: Personalized content discovery for better user engagement.

**Implementation**:
- Backend AI service for recommendations
- RTK Query hooks for data fetching

**API Endpoints**:
- `GET /api/v2/recommendations/matches` - Recommended matches
- `GET /api/v2/recommendations/venues` - Suggested venues
- `GET /api/v2/recommendations/players` - Players you may know
- `GET /api/v2/matches/nearby` - Nearby matches (geo-based)
- `GET /api/v2/venues/nearby` - Nearby venues (geo-based)

**Usage**:
```typescript
import {
  useGetRecommendedMatchesQuery,
  useGetNearbyVenuesQuery
} from '../store/api/recommendationApi';

// Get personalized match recommendations
const { data: matches } = useGetRecommendedMatchesQuery({
  limit: 10,
  sport: 'soccer'
});

// Get nearby venues
const { data: venues } = useGetNearbyVenuesQuery({
  latitude: 37.78,
  longitude: -122.4,
  radius: 5000, // 5km
  sport: 'basketball'
});
```

---

### 6. Advanced Analytics 📊

**Purpose**: Track user behavior and app performance.

**Implementation**:
- `@react-native-firebase/analytics` for event tracking
- `@react-native-firebase/crashlytics` for crash reporting
- Custom event definitions

**Service**:
- `AnalyticsService`: Event logging, user properties, crash reporting

**Usage**:
```typescript
import { analyticsService } from '../services/analyticsService';

// Log custom events
await analyticsService.logMatchJoin('match-123', 'soccer');
await analyticsService.logVenueBooking('venue-456', 5000);
await analyticsService.logPayment(5000, 'USD', 'card');

// Set user properties
await analyticsService.setUserProperties({
  userId: 'user-123',
  email: 'user@example.com',
  role: 'player',
  sport: 'soccer'
});

// Log errors
analyticsService.recordError(error, 'Payment flow');
```

**Pre-defined Events**:
- `login` / `sign_up` - Authentication
- `match_join` / `match_create` - Match participation
- `tournament_join` / `team_join` - Community engagement
- `venue_booking` - Bookings
- `purchase` - Payments
- `search` - Search behavior
- `share` - Content sharing

---

### 7. Offline Support & Persistence 💾

**Purpose**: Reliable app experience with poor connectivity.

**Implementation**:
- `redux-persist` for state persistence
- AsyncStorage as storage backend
- Automatic rehydration on app start

**Configuration**:
- Auth state persisted
- API cache managed by RTK Query
- Automatic retry on network recovery

**Benefits**:
- User stays logged in across app restarts
- Cached data viewable offline
- Optimistic UI updates
- Background sync when online

---

## Setup Instructions

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required variables:
- `STRIPE_PUBLISHABLE_KEY` - Stripe test/live key
- `GOOGLE_MAPS_API_KEY_ANDROID` - Google Maps for Android
- `GOOGLE_MAPS_API_KEY_IOS` - Google Maps for iOS
- `GOOGLE_OAUTH_WEB_CLIENT_ID` - Google Sign-In
- `FACEBOOK_APP_ID` - Facebook Login

### iOS Setup

1. **Maps**: Add to `Info.plist`:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to show nearby matches and venues</string>
```

2. **Biometrics**: Add to `Info.plist`:
```xml
<key>NSFaceIDUsageDescription</key>
<string>We use Face ID for quick and secure login</string>
```

3. **Install Pods**:
```bash
cd ios && pod install && cd ..
```

### Android Setup

1. **Maps**: Add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="${GOOGLE_MAPS_API_KEY_ANDROID}" />
</application>
```

2. **Biometrics**: Add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
```

### Dependencies Installation

```bash
npm install
```

This will install all V2 dependencies:
- `react-native-maps`
- `@stripe/stripe-react-native`
- `react-native-biometrics`
- `i18next` & `react-i18next`
- `redux-persist`
- `@react-native-firebase/analytics`
- `@react-native-firebase/crashlytics`
- Social login libraries

---

## Migration from V1

### Breaking Changes
None - V2 is backward compatible with V1.

### New Optional Features
All V2 features are optional and will gracefully degrade if not configured:
- Maps require API keys and permissions
- Payments require Stripe configuration
- Biometrics work only on supported devices
- Analytics require Firebase setup

### Recommended Migration Steps
1. Update environment variables
2. Configure Firebase for analytics
3. Set up Stripe account and keys
4. Enable Google Maps APIs
5. Test core flows
6. Roll out features incrementally

---

## Testing V2 Features

### Maps
- Test location permissions
- Verify marker display
- Test directions feature
- Check distance calculations

### Payments
- Use Stripe test cards
- Test successful payment: `4242 4242 4242 4242`
- Test declined payment: `4000 0000 0000 0002`
- Verify refund flow

### Biometrics
- Test on physical devices only
- Verify fallback to password
- Test enrollment flow

### Localization
- Switch between English/Hindi
- Verify translations complete
- Test RTL layout readiness

### Analytics
- Verify events in Firebase Console
- Check crash reporting
- Validate user properties

---

## Performance Considerations

### Maps
- Limit marker count (use clustering for >100 markers)
- Cache location results
- Use appropriate zoom levels

### Offline Storage
- Redux persist only auth state (minimal storage)
- RTK Query manages API cache automatically
- Clear cache periodically

### Analytics
- Batch event logging
- Disable in development if needed
- Monitor quota usage

---

## Security

### Payments
- Never store card details locally
- Always use Stripe's secure tokenization
- Validate on backend before charging

### Biometrics
- Store only public keys locally
- Require biometric confirmation for sensitive actions
- Provide password fallback

### Location
- Request permissions only when needed
- Show clear usage descriptions
- Allow users to opt-out

---

## Troubleshooting

### Maps not showing
- Check API key is valid
- Verify permissions granted
- Ensure Google Play Services installed (Android)

### Payments failing
- Verify Stripe key is correct (test vs live)
- Check network connectivity
- Validate amount is in cents

### Biometrics not working
- Only works on physical devices
- Check device supports biometrics
- Ensure permissions granted

### Translations missing
- Verify language code correct
- Check translation keys exist
- Fallback to English if missing

---

## Support & Resources

- [React Native Maps Docs](https://github.com/react-native-maps/react-native-maps)
- [Stripe React Native Docs](https://stripe.com/docs/payments/accept-a-payment?platform=react-native)
- [React Native Biometrics](https://github.com/SelfLender/react-native-biometrics)
- [i18next Documentation](https://www.i18next.com/)
- [Firebase Analytics](https://rnfirebase.io/analytics/usage)

---

## Roadmap (V2.1+)

- [ ] Apple Pay / Google Pay integration
- [ ] Social sharing (Facebook, Twitter)
- [ ] Video calling for virtual matches
- [ ] AR venue preview
- [ ] Advanced AI insights (injury prediction, performance trends)
- [ ] More languages (Spanish, French, Arabic)
- [ ] Dark mode support
- [ ] Accessibility improvements
