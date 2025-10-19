# Sportification Mobile App

## Overview
Sportification is a React Native mobile application for iOS and Android (including tablets and iPads) that provides a comprehensive sports community platform. Its purpose is to enable users to discover and organize sports matches, participate in tournaments, manage teams, book venues, communicate through real-time chat, and receive notifications. Built with TypeScript and React Native, it delivers a responsive, tablet-optimized experience with features including social networking, event coordination, and venue management. The project aims to create a leading mobile platform for sports enthusiasts to connect and engage.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application is built using React Native 0.81.2 with TypeScript 5.9.3, targeting iOS and Android (including tablets and iPads). It leverages React 19.1.1 and the Hermes JavaScript engine for optimized performance, faster startup, and reduced memory usage. Navigation is handled by React Navigation 7.x, supporting both authenticated and unauthenticated flows, with bottom tab navigation for main sections. The UI is designed to be responsive, featuring adaptive layouts, multi-column displays for tablets, and specific utilities for device-aware sizing, font scaling, and spacing.

State management is centralized using Redux Toolkit and RTK Query for server state, caching, and automatic refetching across various API slices (auth, matches, tournaments, teams, venues, chats, notifications). The component architecture is organized by features, with reusable common components and TypeScript interfaces for type safety. Authentication is JWT-based, utilizing `react-native-keychain` for secure token storage and Axios interceptors for automatic token refresh.

### Backend Integration
The application communicates with a RESTful Sportification Backend API, following a `/api/v1` versioning pattern. API responses are standardized with a `{ success, data, message, timestamp }` format, and data structures align with MongoDB's `_id` fields. All API services (Auth, User, Match, Tournament, Team, Venue, Chat, Notification) are integrated with comprehensive CRUD operations and filtering capabilities.

Real-time communication is established via a Socket.IO client, providing type-safe event handling for chat messages, match updates, tournament events, and notifications. It supports room-based subscriptions and uses token-based authentication with automatic reconnection logic.

### Data Storage
Secure storage for JWT tokens (access and refresh) is managed using `react-native-keychain`, leveraging platform-specific secure storage (iOS Keychain, Android KeyStore). Non-sensitive configurations are stored using AsyncStorage. RTK Query provides an effective caching strategy with tag-based invalidation and optimistic updates for mutations.

### Form Handling & Validation
Form management is handled by React Hook Form, integrated with Yup for schema-based validation to ensure client-side data integrity before API submissions.

### UI/UX Patterns
The UI/UX prioritizes a responsive design across devices. Components are designed with variants, clear loading states, and user-friendly error messages. Features like pull-to-refresh and pagination are implemented for data-heavy views. Styling utilizes React Native's StyleSheet API and custom responsive utilities for adaptive font sizes, spacing, and multi-column grids, optimizing touch targets for all devices.

## External Dependencies

### Backend Services
- **Sportification Backend API**: RESTful API providing business logic, authentication, and data persistence, with JWT-based authentication and refresh token support.

### Third-Party Services
- **Firebase Cloud Messaging (FCM)**: Used for cross-platform push notifications via `@react-native-firebase/messaging`.
- **Notifee**: For rich local notification display and management.
- **Socket.IO server**: Provides bidirectional event-based real-time communication.

### Key Libraries
- **Navigation & UI**: `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`, `react-native-vector-icons`, `react-native-safe-area-context`, `react-native-gesture-handler`, `react-native-screens`.
- **State & Data**: `@reduxjs/toolkit`, `react-redux`, `axios`, `socket.io-client`.
- **Utilities**: `date-fns`, `yup`, `react-hook-form` with `@hookform/resolvers`, `react-native-keychain`, `react-native-dotenv`.
- **Development Tools**: TypeScript, ESLint, Prettier, Jest, Babel.