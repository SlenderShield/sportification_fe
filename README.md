# Sportification Mobile App

A cross-platform mobile and web application for sports community management, built with React Native 0.81.2 and TypeScript.

## V2.0 Features 🚀

### New in V2.0
- **🗺️ Maps Integration**: Location-aware matches, tournaments, and venues with Google Maps
- **💳 Payment Processing**: Secure Stripe integration for venue bookings
- **🔐 Biometric Auth**: Quick login with Face ID / Touch ID
- **🌐 Localization**: Multi-language support (English, Hindi)
- **🧠 AI Recommendations**: Personalized match and venue suggestions
- **📊 Advanced Analytics**: Firebase Analytics and Crashlytics
- **💾 Offline Support**: Redux Persist for reliable offline experience
- **👥 Social Login**: Google, Apple, and Facebook authentication

> See [V2_FEATURES.md](./V2_FEATURES.md) for comprehensive V2 documentation.

## Features

### Core Functionality
- **User Authentication**: JWT-based auth with social login (Google, Apple, Facebook)
- **Match Management**: Create, join, and manage sports matches with real-time updates
- **Tournament System**: Bracket-style tournaments with standings and participant management
- **Team Management**: Create teams, manage members, and coordinate activities
- **Venue Booking**: Discover and book sports venues with map view and secure payments
- **Real-time Chat**: Socket.IO-powered messaging for seamless communication
- **Push Notifications**: Firebase Cloud Messaging for instant updates (iOS/Android only)
- **Friends System**: Search, add, and manage your sports network
- **AI Recommendations**: Personalized content based on location and preferences

### Technical Highlights
- **Cross-platform**: iOS, Android, and Web support
- **TypeScript**: Full type safety across the codebase
- **Redux Toolkit**: State management with RTK Query for API caching and Redux Persist
- **React Navigation**: Seamless navigation with stack and tab navigators
- **Secure Storage**: iOS Keychain and Android KeyStore for sensitive data
- **Form Validation**: React Hook Form with Yup schemas
- **Internationalization**: i18next for multi-language support
- **Analytics**: Firebase Analytics and Crashlytics
- **Maps**: React Native Maps with location services

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

The following environment variables need to be configured in Replit Secrets or `.env` file:

```env
# API Configuration
API_BASE_URL=http://your-backend-url:3000
SOCKET_URL=http://your-backend-url:3000

# Stripe Payment
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# Google Maps
GOOGLE_MAPS_API_KEY_ANDROID=your_android_maps_key
GOOGLE_MAPS_API_KEY_IOS=your_ios_maps_key

# Firebase (Mobile only)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Social Login
GOOGLE_OAUTH_WEB_CLIENT_ID=your_google_oauth_client_id
FACEBOOK_APP_ID=your_facebook_app_id
```

For detailed setup, see [V2_FEATURES.md](./V2_FEATURES.md).

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

## 📚 Documentation

### 🆕 Current Documentation (Up-to-Date)
- **[Codebase Index](./CODEBASE_INDEX.md)** - ⭐ Complete feature mapping, module reference, and architecture guide
- **[Feature Reference](./FEATURE_REFERENCE.md)** - Quick lookup for existing functionality and common tasks
- **[Dependency Map](./DEPENDENCY_MAP.md)** - Module dependencies, coupling analysis, and architectural recommendations

### Architecture & Standards (Historical)
- **[Architecture Overview](./ARCHITECTURE.md)** - System architecture and design patterns
- **[Coding Standards](./CODING_STANDARDS.md)** - Code style guide and best practices
- **[Component Guidelines](./COMPONENT_GUIDELINES.md)** - Component design and atomic design principles
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project

### Quick Links
- [Getting Started](#quick-start)
- [Project Structure](#project-structure)
- [Current Features & Modules](./CODEBASE_INDEX.md)
- [Before Adding Code](./FEATURE_REFERENCE.md)

