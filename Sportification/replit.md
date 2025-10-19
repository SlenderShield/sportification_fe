# Sportification Mobile App

## Overview
A cross-platform React Native mobile application for the Sportification sports community platform. The app provides iOS and Android users with comprehensive features for sports match management, tournament coordination, venue bookings, real-time chat, and social networking.

## Project Status
- **Current State**: MVP implementation in progress
- **Last Updated**: October 19, 2025
- **Version**: 0.1.0

## Architecture

### Tech Stack
- **Framework**: React Native 0.76.5 with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Real-time**: Socket.IO client
- **HTTP Client**: Axios with auto-refresh interceptors
- **Storage**: AsyncStorage + React Native Keychain
- **Push Notifications**: Firebase Cloud Messaging (FCM) + Notifee

### Project Structure
```
src/
├── components/       # Reusable UI components
│   ├── common/      # Button, Input, LoadingSpinner
│   ├── matches/     # Match-specific components
│   ├── tournaments/ # Tournament components
│   └── ...
├── navigation/       # Navigation configuration
│   ├── RootNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── MainNavigator.tsx
├── screens/          # Screen components
│   ├── Auth/        # Login, Register
│   ├── Matches/     # Match list, detail, create
│   ├── Tournaments/ # Tournament screens
│   ├── Teams/       # Team management
│   ├── Venues/      # Venue and booking screens
│   ├── Chat/        # Chat screens
│   ├── Notifications/ # Notification center
│   └── Profile/     # User profile
├── services/         # API and utility services
│   ├── api.ts       # Axios instance with JWT refresh
│   └── socketService.ts # Socket.IO connection manager
├── store/            # Redux store configuration
│   ├── index.ts     # Store setup
│   ├── hooks.ts     # Typed hooks
│   ├── slices/      # Redux slices
│   └── api/         # RTK Query API endpoints
├── types/            # TypeScript type definitions
├── config/           # App configuration
└── utils/            # Utility functions
```

## Features Implemented

### Authentication & User Management
- ✅ JWT-based login/register with secure token storage
- ✅ Automatic token refresh on 401 errors
- ✅ User profile display with stats and achievements
- ✅ Friend search and management
- ⏳ Password change (pending)
- ⏳ Profile editing (pending)

### Matches
- ✅ Match browsing with pagination
- ✅ Match detail view
- ⏳ Match creation
- ⏳ Join/leave functionality
- ⏳ Score updates

### Tournaments
- ✅ Tournament listing
- ⏳ Tournament detail with bracket view
- ⏳ Create tournament
- ⏳ Join/leave tournament

### Teams
- ✅ Team listing with member counts and captain display
- ✅ Team detail view with member management
- ✅ Create team form with sport selection
- ✅ Join/leave team functionality
- ✅ Delete team (captain only)
- ✅ Team navigation stack integrated

### Venues & Bookings
- ✅ Venue browsing
- ⏳ Venue detail with availability
- ⏳ Booking creation and management
- ⏳ My bookings view

### Chat
- ✅ Chat list with real-time updates
- ⏳ Chat message view
- ⏳ Send messages
- ✅ Socket.IO integration with auto-reconnect

### Notifications
- ⏳ Notification center
- ⏳ Push notification integration
- ⏳ Unread badge counts

## API Integration
The app connects to the Sportification backend at:
- **Base URL**: Configurable via `.env` file
- **API Version**: `/api/v1`
- **Socket.IO**: Real-time messaging and updates

### Environment Variables
Create a `.env` file in the project root:
```
API_BASE_URL=http://your-backend-url:3000
SOCKET_URL=http://your-backend-url:3000
```

## Development

### Prerequisites
- Node.js 18+
- React Native development environment (Xcode for iOS, Android Studio for Android)

### Installation
```bash
cd Sportification
npm install
```

### Running the App
```bash
# Start Metro bundler
npm start

# iOS
npm run ios

# Android
npm run android
```

## Recent Changes

### October 19, 2025 - Latest Update
- **Team Management Complete**: Implemented full team CRUD with TeamsScreen, TeamDetailScreen, and CreateTeamScreen
- **Navigation Enhancement**: Added Teams tab to bottom navigation with stack navigator
- **Security Fix**: Migrated token storage from AsyncStorage to react-native-keychain for iOS Keychain/Android KeyStore
- **Authentication Flow**: Fixed navigation issues - now relies on auth state instead of manual navigation
- **API Integration**: Updated RootNavigator to use Axios instance instead of direct fetch
- **Testing Documentation**: Created comprehensive TESTING_GUIDE.md with detailed test scenarios

### October 19, 2025 - Initial Implementation
- Initialized React Native project with TypeScript
- Set up Redux Toolkit store with RTK Query API slices
- Implemented authentication service with JWT token management
- Created authentication screens (Login, Register, Profile)
- Set up React Navigation with tab-based structure
- Implemented Socket.IO service with auto-reconnect
- Created initial screen implementations for Matches, Tournaments, Venues, Chat
- Configured API services for all major features

## Known Issues
- LSP errors in some screen files due to type imports
- Push notification setup incomplete
- Several CRUD screens need implementation (Create Match, Create Tournament, etc.)
- Chat message detail screen pending

## Next Steps
1. Complete CRUD screens for Matches and Tournaments
2. Implement push notification handlers
3. Add offline caching for better UX
4. Implement real-time Socket.IO event handlers in screens
5. Add form validation and error handling
6. Set up Firebase for push notifications
7. Add platform-specific configurations (iOS/Android)
8. Implement deep linking for match/tournament invites

## User Preferences
- No specific preferences set yet
