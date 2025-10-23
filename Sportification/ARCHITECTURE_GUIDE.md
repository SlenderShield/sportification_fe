# Architecture Guide

## Overview

This document describes the new architecture implemented in Phase 1 of the refactoring plan. The architecture follows SOLID principles, feature-based organization, and uses dependency injection for loose coupling.

## Folder Structure

```
src/
├── core/                      # Core application infrastructure
│   ├── config/               # App configuration (API, Firebase)
│   ├── constants/            # Global constants (sports, status colors)
│   ├── types/                # Core type definitions (IService, IRepository, etc.)
│   ├── errors/               # Error handling (AppError, NetworkError, etc.)
│   └── di/                   # Dependency injection container
│
├── features/                  # Feature modules (to be populated)
│   ├── auth/
│   ├── matches/
│   ├── teams/
│   ├── tournaments/
│   ├── venues/
│   ├── chat/
│   ├── profile/
│   └── notifications/
│
├── shared/                    # Shared resources
│   ├── components/           # Shared UI components (atomic design)
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── hooks/                # Shared custom hooks
│   ├── utils/                # Shared utility functions
│   ├── contexts/             # Shared React contexts
│   └── services/             # Shared services
│
├── navigation/                # Navigation configuration
│   ├── navigators/           # Navigator definitions
│   ├── routes/               # Route constants
│   └── types/                # Navigation types
│
├── store/                     # Global state management
│   ├── slices/               # Redux slices
│   ├── middleware/           # Custom middleware
│   └── selectors/            # Reselect selectors
│
└── [legacy folders]          # To be migrated
```

## Path Aliases

The following path aliases are configured in `tsconfig.json` and `babel.config.js`:

- `@core/*` - Core infrastructure (`src/core/*`)
- `@features/*` - Feature modules (`src/features/*`)
- `@shared/*` - Shared resources (`src/shared/*`)
- `@navigation/*` - Navigation configuration (`src/navigation/*`)
- `@store/*` - State management (`src/store/*`)
- `@theme/*` - Theme system (`src/theme/*`)
- `@/*` - Any src file (`src/*`)

## Core Abstractions

### IService

Base interface for all services with lifecycle management:

```typescript
import { IService } from '@core';

class MyService implements IService {
  async initialize(): Promise<void> {
    // Initialize resources
  }

  cleanup(): void {
    // Clean up resources
  }
}
```

### IRepository

Base interface for data access with CRUD operations:

```typescript
import { IRepository } from '@core';

class UserRepository implements IRepository<User> {
  async getById(id: string): Promise<User> { /* ... */ }
  async getAll(params?: any): Promise<User[]> { /* ... */ }
  async create(data: Partial<User>): Promise<User> { /* ... */ }
  async update(id: string, data: Partial<User>): Promise<User> { /* ... */ }
  async delete(id: string): Promise<void> { /* ... */ }
}
```

### Error Handling

Use typed error classes for better error handling:

```typescript
import { AppError, NetworkError, ValidationError } from '@core';

// Throw typed errors
throw new ValidationError('Invalid input', { field: ['Required'] });

// Handle errors
try {
  await api.call();
} catch (error) {
  const message = ErrorHandler.getUserMessage(error);
  // Show user-friendly message
}
```

### Logging

Use the centralized logger:

```typescript
import { logger, LogLevel } from '@core';

logger.info('User logged in', { userId: '123' });
logger.error('Failed to fetch data', error, { endpoint: '/api/users' });
logger.setLevel(LogLevel.ERROR); // In production
```

## Dependency Injection

### Container Setup

The DI container manages service dependencies and lifecycle:

```typescript
import { container } from '@core';

// Register services
container.registerSingleton('api', () => new ApiService());
container.registerTransient('logger', () => new ConsoleLogger());

// Initialize all services
await container.initializeAll();
```

### Using Services in Components

Use the `useService` hook to access services:

```typescript
import { useService } from '@core';

const MyComponent: React.FC = () => {
  const apiService = useService<ApiService>('api');
  
  // Use the service
};
```

### Wrapping the App

Wrap your app with `ContainerProvider`:

```typescript
import { ContainerProvider } from '@core';

<ContainerProvider>
  <App />
</ContainerProvider>
```

## Migration Status

### Completed
- ✅ Core infrastructure (config, constants, types, errors, DI)
- ✅ Folder structure for features and shared modules
- ✅ Path aliases configuration
- ✅ Barrel exports for clean imports
- ✅ Updated imports for config and constants

### Pending
- ⏳ Migrate existing screens to feature modules
- ⏳ Migrate existing components to shared/components (atomic design)
- ⏳ Migrate existing hooks to shared/hooks
- ⏳ Migrate existing utils to shared/utils
- ⏳ Refactor services to use DI container
- ⏳ Update App.tsx to use ContainerProvider

## Best Practices

### 1. Feature Isolation
- Features should be self-contained
- Features can depend on `@core` and `@shared` but not on other features
- Cross-feature communication through shared services or state

### 2. Import Organization
```typescript
// External imports
import React from 'react';
import { View } from 'react-native';

// Core imports
import { logger, AppError } from '@core';

// Shared imports
import { Button } from '@shared/components';

// Feature imports
import { useAuth } from '../hooks/useAuth';

// Local imports
import { styles } from './styles';
```

### 3. Component Organization (Atomic Design)
- **Atoms**: Basic building blocks (Button, Input, Text)
- **Molecules**: Simple combinations (FormField = Label + Input + Error)
- **Organisms**: Complex components (Header, Card, Modal)
- **Templates**: Page layouts (ListTemplate, DetailTemplate)

### 4. Type Safety
- Use TypeScript interfaces for all public APIs
- Leverage discriminated unions for state types
- Use generic types for reusable abstractions

### 5. Error Handling
- Use typed error classes
- Always provide user-friendly error messages
- Log errors with context for debugging

## Next Steps

1. Continue migrating files to the new structure
2. Implement feature-based organization for screens
3. Refactor components using atomic design
4. Set up DI container in App.tsx
5. Create shared hooks and utilities
6. Document patterns as they emerge

## Resources

- [REFACTORING_PLAN.md](../../REFACTORING_PLAN.md) - Full refactoring plan
- [REFACTORING_GUIDE.md](../../REFACTORING_GUIDE.md) - Reusability guide
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
