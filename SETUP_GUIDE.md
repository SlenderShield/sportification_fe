# Sportification Mobile App - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- Node.js 18 or higher
- npm or yarn package manager
- iOS: Xcode 14+ (macOS only)
- Android: Android Studio with Android SDK

### Recommended
- VS Code or your preferred IDE
- React Native Debugger
- iOS Simulator (macOS) or Android Emulator

## Installation

### 1. Install Dependencies

```bash
cd Sportification
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your backend API URL:

```env
API_BASE_URL=http://your-backend-url:3000
SOCKET_URL=http://your-backend-url:3000
```

**For local development:**
- iOS Simulator: Use `http://localhost:3000`
- Android Emulator: Use `http://10.0.2.2:3000`
- Physical device: Use your computer's local IP (e.g., `http://192.168.1.100:3000`)

### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 4. Android Setup

No additional setup required. Ensure Android Studio and SDK are properly configured.

## Running the App

### Start Metro Bundler

```bash
npm start
```

This starts the Metro bundler which serves the JavaScript code.

### Run on iOS

In a new terminal:

```bash
npm run ios
```

Or open `ios/Sportification.xcworkspace` in Xcode and run from there.

### Run on Android

In a new terminal:

```bash
npm run android
```

Or open the `android` folder in Android Studio and run from there.

## Backend Requirements

The app expects the backend API to be running with the following endpoints available:

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Token refresh
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/change-password` - Change password

### Matches
- `GET /api/v1/matches` - List matches
- `POST /api/v1/matches` - Create match
- `GET /api/v1/matches/:id` - Get match details
- `POST /api/v1/matches/:id/join` - Join match
- `POST /api/v1/matches/:id/leave` - Leave match
- `PUT /api/v1/matches/:id/score` - Update score

### Tournaments
- `GET /api/v1/tournaments` - List tournaments
- `POST /api/v1/tournaments` - Create tournament
- `GET /api/v1/tournaments/:id` - Get tournament details
- `POST /api/v1/tournaments/:id/join` - Join tournament
- `PUT /api/v1/tournaments/:id/start` - Start tournament

### Venues & Bookings
- `GET /api/v1/venues` - List venues
- `GET /api/v1/venues/:id` - Get venue details
- `POST /api/v1/venues/bookings` - Create booking
- `GET /api/v1/venues/bookings/my-bookings` - Get user's bookings
- `POST /api/v1/venues/bookings/check-availability` - Check availability

### Chat
- `GET /api/v1/chats` - List chats
- `GET /api/v1/chats/:id/messages` - Get chat messages
- `POST /api/v1/chats/:id/messages` - Send message

### Socket.IO Events
The app connects to Socket.IO for real-time features:
- Authentication via JWT token
- Events: `new-message`, `match-updated`, `tournament-updated`
- Rooms: `user:{id}`, `match:{id}`, `tournament:{id}`, `chat:{id}`

## Troubleshooting

### Metro Bundler Issues

If Metro won't start or shows caching issues:

```bash
npm start -- --reset-cache
```

### iOS Build Errors

1. Clean build folder:
   ```bash
   cd ios
   xcodebuild clean
   cd ..
   ```

2. Reinstall pods:
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   ```

### Android Build Errors

1. Clean project:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. Clear gradle cache:
   ```bash
   cd android
   ./gradlew cleanBuildCache
   cd ..
   ```

### Cannot Connect to Backend

1. Verify backend is running and accessible
2. Check firewall settings
3. For Android emulator, use `10.0.2.2` instead of `localhost`
4. For iOS simulator, `localhost` should work
5. For physical devices, ensure device and computer are on same network

### Keychain/KeyStore Issues

If you see keychain-related errors:

**iOS:**
- Ensure you're using an iOS Simulator or device (not just Metro)
- Keychain is only available on real iOS devices/simulators

**Android:**
- KeyStore permissions are automatic
- If issues persist, try uninstalling and reinstalling the app

## Development Tips

### Hot Reloading

The app supports Fast Refresh. Changes to JavaScript files will automatically reload.

### Debugging

1. In iOS Simulator: `Cmd + D` to open dev menu
2. In Android Emulator: `Cmd + M` (Mac) or `Ctrl + M` (Windows/Linux)
3. Enable "Debug JS Remotely" or "Open Debugger"

### Inspecting Network Requests

Use React Native Debugger or Flipper to inspect API calls and Redux state.

### Redux DevTools

Install Redux DevTools extension in your browser and enable "Debug JS Remotely" to inspect Redux state.

## Testing

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

## Next Steps After Setup

1. **Test Authentication**: Try registering a new user and logging in
2. **Browse Features**: Navigate through matches, tournaments, and venues
3. **Test Real-time**: Ensure Socket.IO connection is established
4. **Implement Missing Screens**: See IMPLEMENTATION_NOTES.md for TODO list
5. **Add Push Notifications**: Set up Firebase for iOS and Android
6. **Customize Branding**: Update app icon, splash screen, and theme colors

## Support

For issues or questions:
1. Check IMPLEMENTATION_NOTES.md for known issues
2. Review backend API documentation
3. Ensure all prerequisites are properly installed
4. Check console logs for detailed error messages
