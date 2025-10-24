# Component Guidelines

## Overview

This document provides comprehensive guidelines for creating, organizing, and maintaining React Native components in the Sportification codebase.

## Component Architecture

### Atomic Design Principles

We follow the Atomic Design methodology to create a scalable component library:

```
Atoms → Molecules → Organisms → Templates → Pages
```

#### Atoms (Basic Building Blocks)

**Definition**: Smallest, indivisible UI elements

**Examples**:
- Button
- Input
- Text
- Icon
- Image
- Spinner

**Characteristics**:
- Single responsibility
- Highly reusable
- No business logic
- Minimal or no internal state
- Well-documented props

**Example**:
```typescript
// src/shared/components/atoms/Button.tsx
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  fullWidth?: boolean;
}

/**
 * Primary button component
 * 
 * @param title - Button label text
 * @param onPress - Callback when button is pressed
 * @param variant - Visual style variant
 * @param disabled - Whether button is disabled
 * @param fullWidth - Whether button should take full width
 * 
 * @example
 * ```tsx
 * <Button
 *   title="Submit"
 *   onPress={handleSubmit}
 *   variant="primary"
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
  const { theme } = useTheme();
  
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variant === 'primary' && { backgroundColor: theme.colors.primary },
        variant === 'secondary' && { backgroundColor: theme.colors.secondary },
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
```

#### Molecules (Simple Combinations)

**Definition**: Combinations of atoms that function together as a unit

**Examples**:
- FormField (Label + Input + Error message)
- SearchBox (Input + Icon)
- IconButton (Icon + Button)
- ListItem (Avatar + Text + Icon)

**Characteristics**:
- Composed of 2-3 atoms
- Single, focused functionality
- Reusable across features
- May have minimal state

**Example**:
```typescript
// src/shared/components/molecules/FormField.tsx
interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  secureTextEntry,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        error={!!error}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};
```

#### Organisms (Complex Components)

**Definition**: Complex UI components composed of molecules and atoms

**Examples**:
- Header with navigation and actions
- Card with image, title, description, and actions
- List with filtering and sorting
- Modal with form and actions

**Characteristics**:
- Composed of molecules and atoms
- May have complex interactions
- Feature-specific or reusable
- May connect to state/context

**Example**:
```typescript
// src/shared/components/organisms/Card.tsx
interface CardProps {
  title: string;
  description: string;
  image?: string;
  onPress?: () => void;
  actions?: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  onPress,
  actions,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {actions && <View style={styles.actions}>{actions}</View>}
    </Pressable>
  );
};
```

#### Templates (Page Layouts)

**Definition**: Page-level layouts that compose organisms, molecules, and atoms

**Examples**:
- ListScreenTemplate
- DetailScreenTemplate
- FormScreenTemplate
- EmptyScreenTemplate

**Characteristics**:
- Define page structure
- Reusable across features
- No business logic
- Accept render props for customization

**Example**:
```typescript
// src/shared/components/templates/ListScreenTemplate.tsx
interface ListScreenTemplateProps<T> {
  title: string;
  data: T[];
  loading: boolean;
  error?: string;
  renderItem: (item: T) => ReactNode;
  onRefresh?: () => void;
  onAddNew?: () => void;
  emptyMessage?: string;
}

export function ListScreenTemplate<T>({
  title,
  data,
  loading,
  error,
  renderItem,
  onRefresh,
  onAddNew,
  emptyMessage = 'No items found',
}: ListScreenTemplateProps<T>) {
  return (
    <SafeAreaView style={styles.container}>
      <Header title={title} onAddPress={onAddNew} />
      {error ? (
        <ErrorView message={error} onRetry={onRefresh} />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => renderItem(item)}
          onRefresh={onRefresh}
          refreshing={loading}
          ListEmptyComponent={<EmptyState message={emptyMessage} />}
        />
      )}
    </SafeAreaView>
  );
}
```

## Container/Presenter Pattern

### Separation of Concerns

**Container Component** (Logic):
- Manages state
- Handles side effects
- Contains business logic
- Connects to Redux/context
- Processes data

**Presenter Component** (UI):
- Pure rendering
- Receives props
- No business logic
- No state management
- Easy to test

### Example

```typescript
// Container Component
// src/features/matches/screens/MatchesScreen.tsx
export const MatchesScreen: React.FC = () => {
  const props = useMatchesScreen();
  return <MatchesView {...props} />;
};

// Presenter Component
// src/features/matches/components/MatchesView.tsx
interface MatchesViewProps {
  matches: Match[];
  loading: boolean;
  error?: string;
  onMatchPress: (id: string) => void;
  onRefresh: () => void;
  onCreateMatch: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  loading,
  error,
  onMatchPress,
  onRefresh,
  onCreateMatch,
}) => {
  return (
    <ListScreenTemplate
      title="Matches"
      data={matches}
      loading={loading}
      error={error}
      renderItem={(match) => (
        <MatchCard match={match} onPress={() => onMatchPress(match.id)} />
      )}
      onRefresh={onRefresh}
      onAddNew={onCreateMatch}
    />
  );
};
```

## Component Best Practices

### 1. Props Definition

**Always define prop interfaces**:
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

**Use optional props wisely**:
```typescript
interface ButtonProps {
  title: string;              // Required
  onPress: () => void;        // Required
  variant?: 'primary' | 'secondary';  // Optional with union type
  disabled?: boolean;         // Optional boolean
  icon?: string;              // Optional string
}
```

### 2. Prop Destructuring

**Destructure with defaults**:
```typescript
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
}) => {
  // Component implementation
};
```

### 3. Component Naming

**Use PascalCase**:
- `Button`, `UserCard`, `MatchList`

**Be descriptive**:
- ✅ `UserProfileCard`, `MatchListItem`
- ❌ `Card`, `Item`

**Follow patterns**:
- Screens: `[Feature]Screen` → `MatchesScreen`
- Views: `[Feature]View` → `MatchesView`
- Cards: `[Entity]Card` → `UserCard`
- Lists: `[Entity]List` → `MatchList`

### 4. File Organization

```typescript
// Component file structure
import React from 'react';          // External deps
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@shared/components/atoms';  // Internal deps
import { useAuth } from '@features/auth/hooks';

import type { User } from '../types';  // Types

// Constants
const MAX_ITEMS = 10;

// Types/Interfaces
interface ComponentProps {
  // ...
}

// Helper functions
function formatDate(date: Date): string {
  // ...
}

// Main component
export const Component: React.FC<ComponentProps> = (props) => {
  // Component implementation
};

// Styles
const styles = StyleSheet.create({
  // ...
});
```

### 5. Performance Optimization

**Use React.memo for pure components**:
```typescript
export const UserCard = React.memo<UserCardProps>(({ user, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Text>{user.name}</Text>
    </Pressable>
  );
});
```

**Use useMemo for expensive calculations**:
```typescript
const sortedItems = useMemo(
  () => items.sort((a, b) => a.date - b.date),
  [items]
);
```

**Use useCallback for stable callbacks**:
```typescript
const handlePress = useCallback(
  (id: string) => {
    navigation.navigate('Detail', { id });
  },
  [navigation]
);
```

**Avoid inline functions and objects**:
```typescript
// ❌ Bad - creates new function on every render
<Button onPress={() => handlePress(id)} />

// ✅ Good - stable callback
const handlePressWithId = useCallback(() => handlePress(id), [id]);
<Button onPress={handlePressWithId} />
```

### 6. Styling

**Use StyleSheet.create**:
```typescript
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

**Use theme for consistency**:
```typescript
const { theme } = useTheme();

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
});
```

**Conditional styling**:
```typescript
<View
  style={[
    styles.button,
    variant === 'primary' && styles.primary,
    disabled && styles.disabled,
  ]}
/>
```

### 7. Error Boundaries

**Wrap features in error boundaries**:
```typescript
<FeatureErrorBoundary featureName="Matches">
  <MatchesScreen />
</FeatureErrorBoundary>
```

### 8. Accessibility

**Add accessibility props**:
```typescript
<Pressable
  accessible={true}
  accessibilityLabel="Submit form"
  accessibilityRole="button"
  accessibilityState={{ disabled }}
  onPress={onPress}
>
  <Text>Submit</Text>
</Pressable>
```

## Testing Components

### Unit Tests

```typescript
describe('Button', () => {
  it('should render with title', () => {
    const { getByText } = render(<Button title="Click Me" onPress={jest.fn()} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Click" onPress={onPress} />);
    
    fireEvent.press(getByText('Click'));
    
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Click" onPress={onPress} disabled />
    );
    
    fireEvent.press(getByText('Click'));
    
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

## Component Checklist

Before submitting a component:

- [ ] Props interface defined
- [ ] TypeScript types correct
- [ ] Component documented with JSDoc
- [ ] Follows naming conventions
- [ ] Styled with StyleSheet
- [ ] Uses theme for colors/spacing
- [ ] Accessibility props added
- [ ] Performance optimized (memo/callback)
- [ ] Error handling implemented
- [ ] Unit tests written
- [ ] Reviewed for reusability
- [ ] No console.log statements
- [ ] ESLint passes with no errors

---

**Document Version**: 1.0  
**Last Updated**: October 2024  
**Maintained By**: Development Team
