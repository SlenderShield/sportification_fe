# Features Module

This directory contains feature-based modules following a consistent structure. Each feature is self-contained with its own components, hooks, screens, services, state management, types, and utilities.

## Feature Structure

Each feature follows this structure:
```
feature-name/
├── components/    # Feature-specific UI components
├── hooks/         # Feature-specific custom hooks
├── screens/       # Feature screen components
├── services/      # Feature business logic and API integration
├── store/         # Feature state management (slices, selectors)
├── types/         # Feature-specific TypeScript types
└── utils/         # Feature-specific utilities
```

## Features

- **auth/** - Authentication and authorization
- **matches/** - Match creation, browsing, and management
- **teams/** - Team creation, browsing, and management
- **tournaments/** - Tournament organization and participation
- **venues/** - Venue browsing and booking
- **chat/** - Real-time messaging
- **profile/** - User profiles and settings
- **notifications/** - Push and in-app notifications

## Guidelines

- Each feature should be as self-contained as possible
- Features can depend on `core/` and `shared/` but not on other features
- Cross-feature communication should go through shared services or state
- Use barrel exports (index.ts) for clean imports
