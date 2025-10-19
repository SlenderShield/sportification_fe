# Sportification Mobile App

## Overview

Sportification is a cross-platform React Native mobile application that serves as the mobile companion to a sports community platform. The app enables users to discover and organize sports matches, participate in tournaments, manage teams, book venues, communicate through real-time chat, and receive notifications. Built with TypeScript and React Native 0.76.5, it provides iOS and Android users with comprehensive sports community features including social networking, event coordination, and venue management.

## Recent Changes (October 19, 2025)

**Completed Features:**
- Tournament management with bracket view, join/leave, and start tournament functionality
- Venue booking system with availability checking and booking creation
- Real-time chat integration using Socket.IO for message history and live messaging
- Notifications center with mark as read and navigation to related content
- Profile features: edit profile, change password, friends management (search/add/remove)
- Created userApi service for user and friends management endpoints
- Fixed all type mismatches in Venue and Chat components
- All navigators (Tournaments, Venues, Chats, Profile) integrated into MainNavigator
- Firebase Cloud Messaging (FCM) for push notifications with foreground/background handling
- React Native Web support with webpack configuration for web deployment

**Technical Highlights:**
- Cross-platform support: iOS, Android, and Web
- Push notifications via FCM with Notifee for rich notifications
- Web application served on port 5000 via webpack dev server
- Platform-specific code execution (FCM only on native, web excluded)
- Secure credential storage using iOS Keychain and Android KeyStore
- JWT authentication with automatic token refresh

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Platform**
- React Native 0.76.5 with TypeScript for cross-platform mobile development (iOS & Android)
- Navigation managed through React Navigation with separate stacks for authenticated and unauthenticated flows
- Bottom tab navigation for main app sections (Matches, Tournaments, Teams, Venues, Chats, Profile)

**State Management**
- Redux Toolkit for global application state
- RTK Query for server state management, API caching, and automatic refetching
- Separate API slices for each domain (auth, matches, tournaments, teams, venues, chats, notifications)
- Centralized store configuration with middleware chaining for all API services

**Component Architecture**
- Screen-based organization with dedicated folders for each feature area
- Reusable common components (Button, Input, LoadingSpinner) with variant support
- Feature-specific components organized by domain (matches, tournaments, teams)
- TypeScript interfaces for all props and state to ensure type safety

**Authentication Flow**
- JWT-based authentication with secure token storage using react-native-keychain (iOS Keychain/Android KeyStore)
- Automatic token refresh on 401 responses via Axios interceptors
- Navigation conditional rendering based on authentication state
- Secure logout that clears tokens and disconnects Socket.IO

### Backend Integration

**REST API Communication**
- Axios-based HTTP client with configurable base URL and timeout
- Request interceptor automatically attaches JWT access tokens to headers
- Response interceptor handles token refresh flow without user intervention
- All API endpoints follow `/api/v1` versioning pattern

**Real-time Communication**
- Socket.IO client for real-time updates (chat messages, match updates, notifications)
- Automatic connection on successful authentication
- Exponential backoff reconnection strategy with configurable max attempts
- Event listeners for connection, disconnection, and error handling
- Automatic disconnection on logout

**API Service Domains**
- Auth: login, registration, profile management, stats, achievements, password change
- User: profile updates, friends management (get/search/add/remove)
- Matches: CRUD operations, participant management, scoring, status updates
- Tournaments: creation, joining, bracket viewing, standings
- Teams: team management, membership, captain operations
- Venues: discovery, details, booking creation, availability checking
- Chat: chat listing, message history, sending messages
- Notifications: list retrieval, read status management

### Data Storage

**Secure Storage**
- React Native Keychain for JWT token storage (access & refresh tokens)
- Platform-specific secure storage (iOS Keychain, Android KeyStore)
- AsyncStorage for non-sensitive app configuration and caching

**Caching Strategy**
- RTK Query automatic caching with tag-based invalidation
- Optimistic updates for mutations with automatic rollback on failure
- Pagination support with per-page caching for list views

### Form Handling & Validation

**Form Management**
- React Hook Form for performant form state management
- Yup schema validation for complex validation rules
- Hookform resolvers integration for declarative validation
- Client-side validation before API submission

### UI/UX Patterns

**Component Design**
- Variant-based component system (primary, secondary, outline buttons)
- Loading states with activity indicators
- Error handling with user-friendly messages
- Pull-to-refresh for all list views
- Pagination for large data sets

**Styling**
- StyleSheet API for consistent styling
- Platform-specific adjustments where necessary
- Safe area handling with react-native-safe-area-context
- Gesture handling with react-native-gesture-handler

## External Dependencies

### Backend Services
- **Sportification Backend API**: RESTful API providing all business logic, authentication, and data persistence
  - Base URL configurable via environment variables
  - API version: `/api/v1`
  - JWT-based authentication with refresh token support

### Third-Party Services

**Push Notifications**
- Firebase Cloud Messaging (FCM) for cross-platform push notifications via @react-native-firebase/messaging
- Notifee for local notification display and management with rich formatting

**Real-time Infrastructure**
- Socket.IO server for bidirectional event-based communication
  - WebSocket transport for low-latency updates
  - Token-based authentication for Socket.IO connections

### Key Libraries

**Navigation & UI**
- @react-navigation/native, @react-navigation/stack, @react-navigation/bottom-tabs for navigation
- react-native-vector-icons for iconography
- react-native-safe-area-context for safe area handling
- react-native-gesture-handler for gesture recognition
- react-native-screens for native screen optimization

**State & Data**
- @reduxjs/toolkit for state management and RTK Query
- react-redux for React-Redux bindings
- axios for HTTP client
- socket.io-client for WebSocket communication

**Utilities**
- date-fns for date formatting and manipulation
- yup for schema validation
- react-hook-form with @hookform/resolvers for form handling
- react-native-keychain for secure credential storage
- react-native-dotenv for environment configuration

**Development Tools**
- TypeScript for type safety
- ESLint with @react-native/eslint-config for code quality
- Prettier for code formatting
- Jest for unit testing
- Babel with react-native-dotenv plugin for environment variables