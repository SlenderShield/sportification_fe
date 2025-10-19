# Sportification Mobile App

A cross-platform mobile and web application for sports community management, built with React Native 0.76.5 and TypeScript.

## Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with token refresh
- **Match Management**: Create, join, and manage sports matches with real-time updates
- **Tournament System**: Bracket-style tournaments with standings and participant management
- **Team Management**: Create teams, manage members, and coordinate activities
- **Venue Booking**: Discover and book sports venues with availability checking
- **Real-time Chat**: Socket.IO-powered messaging for seamless communication
- **Push Notifications**: Firebase Cloud Messaging for instant updates (iOS/Android only)
- **Friends System**: Search, add, and manage your sports network

### Technical Highlights
- **Cross-platform**: iOS, Android, and Web support
- **TypeScript**: Full type safety across the codebase
- **Redux Toolkit**: State management with RTK Query for API caching
- **React Navigation**: Seamless navigation with stack and tab navigators
- **Secure Storage**: iOS Keychain and Android KeyStore for sensitive data
- **Form Validation**: React Hook Form with Yup schemas

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- For iOS: macOS with Xcode
- For Android: Android Studio
- For Web: Any modern browser

### Installation

```bash
# Navigate to project directory
cd Sportification

# Install dependencies
npm install

# For iOS only - install pods
cd ios && pod install && cd ..
```

### Running the App

**iOS**:
```bash
npm run ios
```

**Android**:
```bash
npm run android
```

**Web**:
```bash
npm run web
```
The web app will be available at http://localhost:5000

**Metro Bundler** (for development):
```bash
npm start
```

## Configuration

### Environment Variables

The following environment variables are already configured in Replit Secrets:

```env
API_BASE_URL=http://your-backend-url:3000
SOCKET_URL=http://your-backend-url:3000
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### Firebase Setup

1. Create a Firebase project
2. Add iOS and Android apps to your Firebase project
3. Download and replace:
   - `ios/GoogleService-Info.plist`
   - `android/app/google-services.json`
4. Enable Firebase Cloud Messaging in the Firebase Console

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Available Scripts

```bash
npm start          # Start Metro bundler
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run web version on port 5000
npm run build:web  # Build production web bundle
npm run lint       # Run ESLint
npm test           # Run tests
```

## Platform-Specific Notes

### iOS
- Requires Xcode 14 or higher
- Minimum deployment target: iOS 13.4
- Push notifications require Apple Developer account
- CocoaPods must be installed

### Android
- Minimum SDK version: 21 (Android 5.0)
- Target SDK version: 34 (Android 14)
- Requires Android Studio for development
- FCM requires google-services.json configuration

### Web
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Push notifications are not supported on web
- Uses browser localStorage instead of secure native storage
- Served on port 5000 during development

## Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Platform-specific deployment instructions
- [Testing Guide](./TESTING_GUIDE.md) - Comprehensive testing documentation

## License

This project is private and proprietary.
