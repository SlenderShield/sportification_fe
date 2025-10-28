# Authentication & Authorization Feature

## Purpose
Provides comprehensive user authentication with multiple login methods, biometric support, and secure token management.

## Key Components

### Services
- **AuthService.ts**: Core authentication logic (login, register, logout)
- **BiometricService.ts**: Face ID/Touch ID authentication
- **GoogleAuthService.ts**: Google Sign-In integration
- **AppleAuthService.ts**: Apple Sign-In integration
- **FacebookAuthService.ts**: Facebook Login integration

### Screens
- **LoginScreen.tsx**: Email/password and social login UI
- **RegisterScreen.tsx**: User registration form

### State Management
- **authSlice.ts**: Auth state (user, token, isAuthenticated)
- **authApi.ts**: Login, register, logout API endpoints (RTK Query)
- **userApi.ts**: User profile CRUD operations
- **authSelectors.ts**: Memoized selectors for auth state

### Types
- **auth.ts**: User, AuthState, LoginRequest, RegisterRequest interfaces

## Features Implemented

✅ Email/password authentication  
✅ Google Sign-In  
✅ Apple Sign-In  
✅ Facebook Login  
✅ Biometric authentication (Face ID/Touch ID)  
✅ Secure token storage (iOS Keychain, Android KeyStore)  
✅ JWT token management  
✅ Auto-login with stored credentials  
✅ Session persistence

## Dependencies

### External
- `@react-native-google-signin/google-signin` - Google authentication
- `@invertase/react-native-apple-authentication` - Apple authentication
- `react-native-fbsdk-next` - Facebook authentication
- `react-native-biometrics` - Biometric authentication
- `react-native-keychain` - Secure credential storage
- `@react-native-firebase/auth` - Firebase authentication backend

### Internal
- `src/core/types/IService` - Service interface
- `src/core/errors/AppError` - Custom error classes
- `src/shared/utils/validation` - Form validation utilities

## Integration Points

### Used By
- All features requiring authenticated requests
- Navigation (auth state routing in RootNavigator)
- API client (token injection in request headers)

### Uses
- Core configuration for API endpoints
- Shared validation utilities
- Firebase for authentication backend

## Usage Example

```typescript
// Login with email/password
import { useLoginScreenQuery } from './hooks/useLoginScreen';

const { handleLogin } = useLoginScreen();
await handleLogin(email, password);

// Biometric authentication
import { biometricService } from './services/biometricService';

const isAvailable = await biometricService.checkAvailability();
if (isAvailable) {
  await biometricService.authenticate();
}
```

## Business Rules

- Password must be at least 6 characters
- Email must be valid format
- Username must be at least 3 characters
- Failed login attempts are tracked
- Tokens expire after configured duration
- Biometric authentication requires device support

## Reusability Notes

- **High Reusability**: Core auth logic used by all features
- **Extension Points**: Easy to add new auth providers
- **Security**: Follows platform best practices for credential storage
- **Pattern**: Service-Repository pattern can be replicated for other features
