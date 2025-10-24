# JSDoc Documentation Guide

## Overview

This guide provides comprehensive standards for documenting TypeScript code in the Sportification codebase using JSDoc comments. Following these standards ensures that code is self-explanatory and easy to understand for all developers.

## Why Documentation Matters

Well-documented code:
- **Reduces onboarding time** for new developers
- **Prevents bugs** by making intent clear
- **Improves maintainability** by explaining complex logic
- **Enhances IDE support** with better autocomplete and type hints
- **Serves as living documentation** that stays in sync with code

## JSDoc Basics

### File-Level Documentation

Every file should start with a file-level docstring:

```typescript
/**
 * @fileoverview Brief description of what this file contains.
 * 
 * Longer description explaining the purpose, patterns used,
 * and how it fits into the larger system.
 * 
 * @module moduleName
 */
```

### Function Documentation

Every exported function must have JSDoc:

```typescript
/**
 * Brief one-line description of what the function does.
 * 
 * Optional longer description with more details about behavior,
 * edge cases, or important notes about usage.
 * 
 * @param {Type} paramName - Description of the parameter
 * @param {Type} [optionalParam] - Description (note the brackets for optional)
 * @param {Type} [paramWithDefault=defaultValue] - Param with default value
 * @returns {ReturnType} Description of what is returned
 * @throws {ErrorType} Description of when this error is thrown
 * 
 * @example
 * ```typescript
 * // Example usage
 * const result = myFunction('input', 42);
 * console.log(result); // Expected output
 * ```
 * 
 * @see {@link relatedFunction} for related functionality
 */
export function myFunction(
  paramName: Type,
  optionalParam?: Type,
  paramWithDefault: Type = defaultValue
): ReturnType {
  // Implementation
}
```

### Class Documentation

Document classes and their members:

```typescript
/**
 * Brief description of the class purpose.
 * 
 * Longer description explaining responsibilities, patterns,
 * and usage guidelines.
 * 
 * @class ClassName
 * @implements {InterfaceName}
 * 
 * @example
 * ```typescript
 * const instance = new ClassName(config);
 * instance.doSomething();
 * ```
 */
export class ClassName implements InterfaceName {
  /**
   * Description of the property.
   * @private
   */
  private propertyName: Type;

  /**
   * Create a new instance.
   * 
   * @param {ConfigType} config - Configuration object
   * @throws {ValidationError} If config is invalid
   */
  constructor(config: ConfigType) {
    // Implementation
  }

  /**
   * Description of what this method does.
   * 
   * @param {ParamType} param - Parameter description
   * @returns {ReturnType} What is returned
   * 
   * @example
   * ```typescript
   * instance.methodName('value');
   * ```
   */
  public methodName(param: ParamType): ReturnType {
    // Implementation
  }
}
```

### Interface Documentation

Document interfaces and their properties:

```typescript
/**
 * Description of what this interface represents.
 * 
 * Explain when and how it should be used.
 * 
 * @interface InterfaceName
 * 
 * @property {Type} propertyName - Description of this property
 * @property {Type} [optionalProperty] - Optional property description
 */
export interface InterfaceName {
  /** Brief description of property */
  propertyName: Type;
  
  /** Optional property with default behavior */
  optionalProperty?: Type;
  
  /**
   * Description of method signature.
   * 
   * @param {ParamType} param - Parameter description
   * @returns {ReturnType} Return value description
   */
  methodName(param: ParamType): ReturnType;
}
```

### Type Alias Documentation

Document type aliases:

```typescript
/**
 * Description of what this type represents.
 * 
 * Explain the different possible values and when to use each.
 * 
 * @typedef {string} TypeName
 * 
 * @example
 * ```typescript
 * const status: Status = 'active';
 * ```
 */
export type Status = 'active' | 'inactive' | 'pending';

/**
 * Complex type with multiple properties.
 * 
 * @typedef {Object} ConfigType
 * @property {string} apiUrl - Base URL for API requests
 * @property {number} timeout - Request timeout in milliseconds
 * @property {boolean} [retryEnabled] - Whether to retry failed requests
 */
export type ConfigType = {
  apiUrl: string;
  timeout: number;
  retryEnabled?: boolean;
};
```

### Enum Documentation

Document enums and their values:

```typescript
/**
 * Enumeration of possible log severity levels.
 * 
 * Used to control logging verbosity and filtering.
 * Levels are ordered from least to most severe.
 * 
 * @enum {string}
 * 
 * @example
 * ```typescript
 * logger.setLevel(LogLevel.WARN);
 * ```
 */
export enum LogLevel {
  /** Detailed diagnostic information */
  DEBUG = 'debug',
  
  /** General informational messages */
  INFO = 'info',
  
  /** Warning messages for potentially harmful situations */
  WARN = 'warn',
  
  /** Error messages for serious problems */
  ERROR = 'error',
}
```

### Constant Documentation

Document important constants:

```typescript
/**
 * Maximum number of retry attempts for failed API requests.
 * 
 * After this many failures, the request will be abandoned and
 * an error will be thrown to the caller.
 * 
 * @constant {number}
 * @default 3
 */
export const MAX_RETRIES = 3;

/**
 * Configuration object for date formatting.
 * 
 * Provides centralized format patterns using date-fns syntax.
 * 
 * @constant
 * @type {Readonly<Record<string, string>>}
 */
export const DATE_FORMATS = {
  /** User-friendly date (e.g., "Jan 15, 2025") */
  DISPLAY_DATE: 'MMM dd, yyyy',
  /** ISO format (e.g., "2025-01-15") */
  ISO_DATE: 'yyyy-MM-dd',
} as const;
```

## Documentation Standards by File Type

### Utility Functions

Utility functions need special attention because they're reused everywhere:

```typescript
/**
 * Capitalize the first letter of a string.
 * 
 * Converts the first character to uppercase and the rest to lowercase.
 * Returns empty string if input is empty or null.
 * 
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 * 
 * @example
 * ```typescript
 * capitalize('hello');  // "Hello"
 * capitalize('HELLO');  // "Hello"
 * capitalize('');       // ""
 * ```
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
```

### React Components

Document component props and behavior:

```typescript
/**
 * Button component props interface.
 * 
 * @interface ButtonProps
 */
interface ButtonProps {
  /** Button label text to display */
  title: string;
  
  /** Callback fired when button is pressed */
  onPress: () => void;
  
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline';
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Whether button should take full width */
  fullWidth?: boolean;
}

/**
 * Primary button component with multiple style variants.
 * 
 * Provides consistent button styling across the application with
 * support for different variants, disabled state, and full-width layout.
 * 
 * @component
 * @param {ButtonProps} props - Component props
 * @returns {React.ReactElement} Rendered button
 * 
 * @example
 * ```tsx
 * <Button
 *   title="Submit"
 *   onPress={handleSubmit}
 *   variant="primary"
 *   disabled={isLoading}
 * />
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}) => {
  // Implementation
};
```

### Custom Hooks

Document hook behavior, parameters, and return values:

```typescript
/**
 * Return type for useAuth hook.
 * 
 * @typedef {Object} UseAuthReturn
 * @property {User | null} user - Currently logged-in user or null
 * @property {boolean} isLoading - Whether auth state is being determined
 * @property {boolean} isAuthenticated - Whether user is logged in
 * @property {Function} login - Function to log in a user
 * @property {Function} logout - Function to log out current user
 */
interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Hook for managing authentication state and operations.
 * 
 * Provides access to current user, auth status, and auth actions.
 * Automatically subscribes to auth state changes and cleans up on unmount.
 * 
 * @hook
 * @returns {UseAuthReturn} Auth state and operations
 * 
 * @example
 * ```typescript
 * function LoginScreen() {
 *   const { user, isLoading, login, logout } = useAuth();
 *   
 *   if (isLoading) return <Spinner />;
 *   
 *   return user ? (
 *     <Button title="Logout" onPress={logout} />
 *   ) : (
 *     <Button title="Login" onPress={() => login(credentials)} />
 *   );
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  // Implementation
}
```

### Services

Document service methods and their responsibilities:

```typescript
/**
 * Service for managing user authentication.
 * 
 * Handles login, logout, token management, and session persistence.
 * Uses JWT tokens stored securely in device keychain.
 * 
 * @class AuthService
 * @implements {IAuthService}
 */
export class AuthService implements IAuthService {
  /**
   * Authenticate a user with credentials.
   * 
   * Sends credentials to API, stores returned tokens securely,
   * and updates auth state. Throws error if credentials are invalid.
   * 
   * @async
   * @param {LoginCredentials} credentials - User credentials
   * @returns {Promise<User>} Authenticated user object
   * @throws {AuthenticationError} If credentials are invalid
   * @throws {NetworkError} If API request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const user = await authService.login({
   *     email: 'user@example.com',
   *     password: 'password123'
   *   });
   *   console.log('Logged in as:', user.name);
   * } catch (error) {
   *   console.error('Login failed:', error.message);
   * }
   * ```
   */
  async login(credentials: LoginCredentials): Promise<User> {
    // Implementation
  }
}
```

## Common JSDoc Tags

### Core Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `@param` | Document function parameter | `@param {string} name - User's name` |
| `@returns` | Document return value | `@returns {boolean} True if valid` |
| `@throws` | Document thrown errors | `@throws {Error} If input is invalid` |
| `@example` | Provide usage example | See examples above |
| `@see` | Link to related code | `@see {@link relatedFunction}` |
| `@deprecated` | Mark as deprecated | `@deprecated Use newFunction instead` |
| `@since` | When it was added | `@since v2.0.0` |
| `@todo` | Note future work | `@todo Add validation` |

### Type Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `@type` | Specify variable type | `@type {string}` |
| `@typedef` | Define custom type | `@typedef {Object} Config` |
| `@property` | Define object property | `@property {string} name` |
| `@enum` | Define enumeration | `@enum {string}` |
| `@interface` | Define interface | `@interface UserData` |

### Module Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `@module` | Define module | `@module utils/date` |
| `@fileoverview` | File description | See examples above |
| `@author` | Code author | `@author John Doe` |
| `@version` | Current version | `@version 1.0.0` |

### React-Specific

| Tag | Purpose | Example |
|-----|---------|---------|
| `@component` | Mark as component | `@component` |
| `@hook` | Mark as custom hook | `@hook` |
| `@prop` | Document component prop | `@prop {string} title` |

## Best Practices

### DO

✅ **Write clear, concise descriptions**
```typescript
/**
 * Format a number as currency with proper symbol and decimals.
 */
```

✅ **Provide meaningful examples**
```typescript
/**
 * @example
 * ```typescript
 * formatCurrency(1234.56);  // "$1,234.56"
 * formatCurrency(1234.56, 'EUR');  // "€1,234.56"
 * ```
 */
```

✅ **Document edge cases and special behavior**
```typescript
/**
 * Parse user input into a number.
 * Returns null if input is not a valid number.
 * Handles comma-separated thousands (e.g., "1,234").
 */
```

✅ **Use proper TypeScript types**
```typescript
/**
 * @param {User | null} user - User object or null if not logged in
 * @returns {string} User's display name or "Guest"
 */
```

✅ **Link to related documentation**
```typescript
/**
 * @see {@link formatDate} for date formatting
 * @see {@link DATE_FORMATS} for available formats
 */
```

### DON'T

❌ **State the obvious**
```typescript
/**
 * Returns the sum of two numbers
 */
function add(a: number, b: number): number {
  return a + b;
}
```

❌ **Duplicate type information**
```typescript
/**
 * @param {string} name - A string containing the name
 * @returns {string} Returns a string
 */
```

❌ **Leave documentation outdated**
```typescript
/**
 * @deprecated
 */
export function oldFunction() { } // Remove or update!
```

❌ **Over-document simple code**
```typescript
const PI = 3.14159; // Not needed - name is clear
```

❌ **Use vague descriptions**
```typescript
/**
 * Does stuff with data
 */
function processData(data: any): void { }
```

## Documentation Checklist

Before committing code, ensure:

- [ ] Every exported function has JSDoc
- [ ] All parameters are documented with types
- [ ] Return values are documented
- [ ] At least one usage example is provided
- [ ] Complex logic has explanatory comments
- [ ] Interfaces and types are documented
- [ ] Classes and their public methods are documented
- [ ] Custom hooks document their return types
- [ ] React components document their props
- [ ] Error conditions are documented
- [ ] Edge cases are explained
- [ ] Related code is cross-referenced

## IDE Integration

Most IDEs provide excellent JSDoc support:

### VS Code
- Hover over a function to see its documentation
- `Ctrl+Space` for autocomplete with JSDoc hints
- `/**` + Enter to generate JSDoc template

### WebStorm/IntelliJ
- Similar hover and autocomplete features
- Built-in JSDoc validation
- Quick-fix suggestions for incomplete docs

### ESLint Integration
```javascript
// .eslintrc.js
rules: {
  'jsdoc/require-jsdoc': 'warn',
  'jsdoc/require-param': 'warn',
  'jsdoc/require-returns': 'warn',
}
```

## Conclusion

Good documentation is an investment that pays dividends:
- Faster development
- Fewer bugs
- Easier onboarding
- Better collaboration
- Maintainable codebase

**Remember**: Code is read far more often than it's written. Make it count!

---

**Document Version**: 1.0  
**Last Updated**: October 2024  
**Maintained By**: Development Team
