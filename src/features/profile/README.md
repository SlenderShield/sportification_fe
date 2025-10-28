# Profile Feature

## Purpose
Manage user profiles, settings, friends, and payment methods.

## Key Components

### Services
- **ProfileService.ts**: User profile management
- **PaymentService.ts**: Stripe integration for payment processing

### Components
- **PaymentForm.tsx**: Reusable payment form with card input

### Screens
- **ProfileScreen.tsx**: View user profile and stats
- **EditProfileScreen.tsx**: Edit profile information
- **SettingsScreen.tsx**: App settings (theme, notifications, language)
- **AccessibilitySettingsScreen.tsx**: Accessibility preferences
- **FriendsScreen.tsx**: Friends list and search
- **ChangePasswordScreen.tsx**: Password update

### State Management
- **paymentApi.ts**: RTK Query API for payment operations

### Repositories
- **ProfileRepository.ts**: Data access layer for profile API calls

### Types
- **payment.ts**: PaymentIntent, PaymentMethod, Card interfaces

## Features Implemented

✅ Profile viewing and editing  
✅ Password management  
✅ Profile photo upload  
✅ App settings (theme, language, notifications)  
✅ Accessibility settings (screen reader, font size, contrast)  
✅ Friends management (search, add, remove)  
✅ Payment methods (add, remove, default)  
✅ Payment history  
✅ Biometric authentication setup  
✅ Account deletion

## Dependencies

### External
- `@stripe/stripe-react-native` - Payment processing
- `react-native-image-picker` - Profile photo upload
- `react-native-biometrics` - Biometric setup

### Internal
- `src/features/auth/services/biometricService` - Biometric authentication
- `src/shared/utils/validation` - Form validation
- `src/shared/components/atoms/Input` - Form inputs

## Integration Points

### Used By
- All features displaying user information
- Venues feature for payment processing

### Uses
- Auth feature for user authentication
- Storage utilities for photo caching

## Usage Example

```typescript
// Update profile
import { useUpdateProfileMutation } from '../store/authApi';

const [updateProfile] = useUpdateProfileMutation();
await updateProfile({
  displayName: 'John Doe',
  bio: 'Soccer enthusiast'
}).unwrap();

// Add payment method
import { useCreatePaymentIntentMutation } from '../store/paymentApi';
import { paymentService } from '../services/paymentService';

const [createIntent] = useCreatePaymentIntentMutation();

const { clientSecret } = await createIntent({
  amount: 5000, // Setup intent
  currency: 'USD'
}).unwrap();

// Use PaymentForm component
<PaymentForm
  clientSecret={clientSecret}
  onSuccess={(paymentMethodId) => {
    console.log('Payment method added:', paymentMethodId);
  }}
/>

// Search friends
import { useSearchUsersQuery } from '../store/userApi';

const { data: users } = useSearchUsersQuery(searchTerm);
```

## Business Rules

- Display name must be 2-50 characters
- Bio limited to 500 characters
- Profile photos must be under 5MB
- Password changes require current password
- Payment methods require verification
- Friend requests can be accepted/rejected

## Reusability Notes

- **Payment Components**: PaymentForm and PaymentService highly reusable
- **Settings Pattern**: Settings screen structure applicable to other config screens
- **Form Validation**: Profile forms demonstrate validation patterns
- **Image Upload**: Photo upload logic reusable for other image features

## Recommended Refactoring

### Consider Moving to Shared
- `PaymentForm.tsx` → `src/shared/components/organisms/PaymentForm.tsx`
- `paymentService.ts` → `src/shared/services/paymentService.ts`

These payment components could be useful in:
- Tournament entry fees
- Match participation fees
- Venue bookings (already used)
- Premium features
