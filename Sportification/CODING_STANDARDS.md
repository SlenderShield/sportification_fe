# Coding Standards

## Overview

This document establishes coding standards and best practices for the Sportification React Native codebase. Following these guidelines ensures consistency, maintainability, and code quality across the project.

## General Principles

### Code Quality
- **KISS**: Keep It Simple, Stupid - prefer simple solutions
- **DRY**: Don't Repeat Yourself - extract common patterns
- **YAGNI**: You Aren't Gonna Need It - don't over-engineer
- **SOLID**: Follow SOLID principles for object-oriented design

### Readability
- Code should be self-documenting
- Use meaningful names for variables, functions, and files
- Keep functions small and focused
- Add comments only when necessary to explain "why", not "what"

## TypeScript Standards

### Type Safety

**Always use explicit types**
```typescript
// ✅ Good
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// ❌ Bad
function calculateTotal(price, quantity) {
  return price * quantity;
}
```

**Avoid `any` type**
```typescript
// ✅ Good
interface ApiResponse<T> {
  data: T;
  error?: string;
}

// ❌ Bad
function processResponse(response: any) {
  // ...
}
```

**Use `unknown` for truly unknown types**
```typescript
// ✅ Good
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}
```

### Interfaces vs Types

**Use interfaces for object shapes**
```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}
```

**Use types for unions, intersections, and utilities**
```typescript
// ✅ Good
type Status = 'pending' | 'approved' | 'rejected';
type UserWithRole = User & { role: string };
```

### Null Safety

**Use optional chaining**
```typescript
// ✅ Good
const userName = user?.profile?.name;

// ❌ Bad
const userName = user && user.profile && user.profile.name;
```

**Use nullish coalescing**
```typescript
// ✅ Good
const displayName = user.name ?? 'Guest';

// ❌ Bad
const displayName = user.name || 'Guest'; // Fails for empty string
```

## React & React Native Standards

### Component Structure

**Functional components with TypeScript**
```typescript
// ✅ Good
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </Pressable>
  );
};
```

### Props

**Define prop interfaces**
```typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onPress: (userId: string) => void;
  showActions?: boolean;
}

// ❌ Bad
const UserCard = (props) => { /* ... */ };
```

**Destructure props**
```typescript
// ✅ Good
const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  showActions = true,
}) => {
  // ...
};

// ❌ Bad
const UserCard: React.FC<UserCardProps> = (props) => {
  const user = props.user;
  // ...
};
```

### Hooks

**Custom hooks for reusable logic**
```typescript
// ✅ Good
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

**Follow hooks rules**
- Always call hooks at the top level
- Don't call hooks conditionally
- Use ESLint plugin for hooks

**Memoization**
```typescript
// ✅ Good - memoize expensive calculations
const sortedItems = useMemo(
  () => items.sort((a, b) => a.date - b.date),
  [items]
);

// ✅ Good - memoize callbacks passed to child components
const handlePress = useCallback(
  (id: string) => {
    navigation.navigate('Detail', { id });
  },
  [navigation]
);
```

### State Management

**Use local state when possible**
```typescript
// ✅ Good
const [isOpen, setIsOpen] = useState(false);
```

**Use Redux for global/shared state**
```typescript
// ✅ Good
const user = useAppSelector(state => state.auth.user);
const dispatch = useAppDispatch();
```

**Use RTK Query for server state**
```typescript
// ✅ Good
const { data, isLoading, error } = useGetMatchesQuery();
```

## Naming Conventions

### Files and Folders

**Components**: PascalCase
```
Button.tsx
UserCard.tsx
MatchList.tsx
```

**Hooks**: camelCase with 'use' prefix
```
useAuth.ts
useDebounce.ts
useMatchesScreen.ts
```

**Utilities**: camelCase
```
dateUtils.ts
stringUtils.ts
validationUtils.ts
```

**Types**: PascalCase with .types.ts suffix
```
user.types.ts
match.types.ts
api.types.ts
```

### Variables and Functions

**Variables**: camelCase
```typescript
const userName = 'John';
const isLoading = true;
const matchCount = 10;
```

**Functions**: camelCase, verb-noun pattern
```typescript
function getUserById(id: string): User { /* ... */ }
function formatDate(date: Date): string { /* ... */ }
```

**Constants**: UPPER_SNAKE_CASE
```typescript
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 5000;
```

**Boolean variables**: Use is/has/should prefix
```typescript
const isLoading = true;
const hasPermission = false;
const shouldRender = true;
```

**Event handlers**: Use 'handle' prefix
```typescript
const handlePress = () => { /* ... */ };
const handleSubmit = () => { /* ... */ };
const handleChange = (value: string) => { /* ... */ };
```

### Classes and Interfaces

**Classes**: PascalCase
```typescript
class MatchService { /* ... */ }
class ApiClient { /* ... */ }
```

**Interfaces**: PascalCase
```typescript
interface User { /* ... */ }
interface MatchServiceConfig { /* ... */ }
```

**Types**: PascalCase
```typescript
type Status = 'active' | 'inactive';
type UserRole = 'admin' | 'user';
```

## Code Organization

### Import Order

```typescript
// 1. External dependencies
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 2. Internal dependencies (absolute imports)
import { Button } from '@shared/components/atoms';
import { useAuth } from '@features/auth/hooks';
import { logger } from '@core';

// 3. Relative imports
import { MatchCard } from './MatchCard';
import { useMatchesScreen } from '../hooks';

// 4. Types
import type { Match } from '../types';
import type { NavigationProp } from '@navigation/types';

// 5. Styles
import { styles } from './styles';
```

### File Structure

```typescript
/**
 * Component/Function description
 */

// 1. Imports
import ...

// 2. Types/Interfaces
interface Props { /* ... */ }
type State = { /* ... */ };

// 3. Constants
const DEFAULT_VALUE = 10;

// 4. Helper functions
function calculateTotal(...) { /* ... */ }

// 5. Main component/function
export const Component: React.FC<Props> = (props) => {
  // Hooks
  const [state, setState] = useState();
  
  // Event handlers
  const handlePress = () => { /* ... */ };
  
  // Render
  return ( /* ... */ );
};

// 6. Styles (if not in separate file)
const styles = StyleSheet.create({ /* ... */ });
```

## Comments and Documentation

### JSDoc Comments

**Document public APIs**
```typescript
/**
 * Calculates the total price including tax
 * 
 * @param price - Base price before tax
 * @param taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @returns Total price including tax
 * 
 * @example
 * ```typescript
 * const total = calculateTotal(100, 0.1); // Returns 110
 * ```
 */
export function calculateTotal(price: number, taxRate: number): number {
  return price * (1 + taxRate);
}
```

**Document complex logic**
```typescript
// Calculate fibonacci using memoization to avoid redundant calculations
const fibonacci = useMemo(() => {
  const memo: Record<number, number> = {};
  
  function fib(n: number): number {
    if (n <= 1) return n;
    if (memo[n]) return memo[n];
    
    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
  }
  
  return fib;
}, []);
```

### When NOT to comment

❌ **Don't comment obvious code**
```typescript
// ❌ Bad
// Set user name to John
const userName = 'John';

// Increment counter
counter++;
```

✅ **Write self-documenting code instead**
```typescript
// ✅ Good
const defaultUserName = 'John';
counter++;
```

## Error Handling

### Try-Catch Blocks

```typescript
// ✅ Good
try {
  const data = await fetchData();
  processData(data);
} catch (error) {
  logger.error('Failed to fetch data', error instanceof Error ? error : undefined);
  showToast('Failed to load data', 'error');
}
```

### Error Types

```typescript
// ✅ Good - custom error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NetworkError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'NetworkError';
  }
}
```

### Error Messages

```typescript
// ✅ Good - user-friendly messages
throw new Error('Unable to save match. Please check your connection.');

// ❌ Bad - technical jargon
throw new Error('POST /api/matches 500 Internal Server Error');
```

## Testing

### Test File Naming

```
Button.tsx → Button.test.tsx
useAuth.ts → useAuth.test.ts
dateUtils.ts → dateUtils.test.ts
```

### Test Structure

```typescript
describe('Button', () => {
  describe('when pressed', () => {
    it('should call onPress callback', () => {
      const onPress = jest.fn();
      const { getByText } = render(<Button title="Click" onPress={onPress} />);
      
      fireEvent.press(getByText('Click'));
      
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('when disabled', () => {
    it('should not call onPress callback', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <Button title="Click" onPress={onPress} disabled />
      );
      
      fireEvent.press(getByText('Click'));
      
      expect(onPress).not.toHaveBeenCalled();
    });
  });
});
```

## Performance

### Avoid Inline Functions in Render

```typescript
// ❌ Bad
<Button onPress={() => handlePress(id)} />

// ✅ Good
const handlePressWithId = useCallback(
  () => handlePress(id),
  [id, handlePress]
);
<Button onPress={handlePressWithId} />
```

### Avoid Inline Objects/Arrays

```typescript
// ❌ Bad
<Component style={{ marginTop: 10 }} />

// ✅ Good
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});
<Component style={styles.container} />
```

### Use React.memo for Pure Components

```typescript
// ✅ Good
export const UserCard = React.memo<UserCardProps>(({ user, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Text>{user.name}</Text>
    </Pressable>
  );
});
```

## Styling

### StyleSheet.create

```typescript
// ✅ Good
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### Use Theme

```typescript
// ✅ Good
const { theme } = useTheme();

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
});
```

## Security

### Sensitive Data

```typescript
// ✅ Good - use secure storage
await SecureStore.setItemAsync('auth_token', token);

// ❌ Bad - insecure
await AsyncStorage.setItem('auth_token', token);
```

### Input Validation

```typescript
// ✅ Good
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

if (!validateEmail(userInput)) {
  throw new ValidationError('Invalid email format');
}
```

## Git Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(auth): add biometric authentication

Implement fingerprint and face ID authentication for iOS and Android.
Users can now login using biometric data instead of password.

Closes #123
```

```
fix(matches): prevent duplicate match creation

Add validation to check for existing matches before creating new ones.
This prevents users from accidentally creating duplicate matches.
```

## Code Review Checklist

- [ ] Code follows established patterns
- [ ] TypeScript types are properly defined
- [ ] No `any` types (unless absolutely necessary with comment)
- [ ] Functions are small and focused
- [ ] Proper error handling
- [ ] No console.log (use logger service)
- [ ] Tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed

---

**Document Version**: 1.0  
**Last Updated**: October 2024  
**Maintained By**: Development Team
