# Accessibility Implementation Guide

This guide documents the accessibility features implemented in the Sportification app and provides guidance for maintaining and extending accessibility support.

## Overview

The app now includes comprehensive accessibility features following WCAG 2.1 AA guidelines, with support for screen readers, keyboard navigation, and assistive technologies.

## Implemented Features

### 1. Component Accessibility

All interactive components now include proper accessibility attributes:

#### Button Component
```typescript
<Button
  title="Submit"
  onPress={handleSubmit}
  accessibilityLabel="Submit form"
  accessibilityHint="Submits the form and saves your changes"
  testID="submit-button"
/>
```

**Accessibility Features:**
- `accessibilityRole="button"` - Identifies as button to screen readers
- `accessibilityLabel` - Custom label (defaults to title)
- `accessibilityHint` - Additional context for users
- `accessibilityState` - Conveys disabled/busy states
- `testID` - For automated testing

#### IconButton Component
```typescript
<IconButton
  icon="close"
  onPress={handleClose}
  accessibilityLabel="Close dialog"
  accessibilityHint="Dismisses the current dialog"
/>
```

**Accessibility Features:**
- Automatic label generation from icon name
- Custom labels supported
- Disabled state announced
- Proper button role

#### Chip Component
```typescript
<Chip
  label="Football"
  selected={true}
  onPress={handleSelect}
  accessibilityLabel="Football sport"
  accessibilityHint="Selected"
/>
```

**Accessibility Features:**
- Selection state announced
- Role changes based on interactivity (button vs text)
- Custom hints for selection state

#### FAB (Floating Action Button)
```typescript
<FAB
  icon="plus"
  onPress={handleAdd}
  accessibilityLabel="Add new match"
  accessibilityHint="Opens form to create a new match"
/>
```

### 2. Accessibility Utilities

Created `src/utils/accessibility.ts` with helper functions:

#### Button Accessibility Props
```typescript
import { getButtonAccessibilityProps } from '../utils/accessibility';

const props = getButtonAccessibilityProps(
  'Save Changes',
  'Saves your profile information',
  isDisabled,
  isSaving
);

<Pressable {...props} onPress={handleSave}>
  {/* content */}
</Pressable>
```

#### Form Field Labels
```typescript
import { getFormFieldLabel } from '../utils/accessibility';

const label = getFormFieldLabel('Email', true, currentEmail);
// Returns: "Email, required, current value: user@example.com"
```

#### Accessibility Announcements
```typescript
import { createAccessibilityAnnouncement } from '../utils/accessibility';

const message = createAccessibilityAnnouncement('success', 'Profile saved');
// Returns: "Success: Profile saved"

// Use with AccessibilityInfo.announceForAccessibility()
import { AccessibilityInfo } from 'react-native';
AccessibilityInfo.announceForAccessibility(message);
```

#### Toggle/Switch Props
```typescript
import { getToggleAccessibilityProps } from '../utils/accessibility';

const props = getToggleAccessibilityProps(
  'Dark mode',
  isDarkMode,
  false
);

<Switch {...props} value={isDarkMode} onChange={handleToggle} />
```

## Best Practices

### 1. Always Provide Meaningful Labels

❌ **Bad:**
```typescript
<IconButton icon="check" onPress={handleConfirm} />
```

✅ **Good:**
```typescript
<IconButton
  icon="check"
  onPress={handleConfirm}
  accessibilityLabel="Confirm selection"
/>
```

### 2. Add Context with Hints

❌ **Bad:**
```typescript
<Button title="Delete" onPress={handleDelete} />
```

✅ **Good:**
```typescript
<Button
  title="Delete"
  onPress={handleDelete}
  accessibilityLabel="Delete match"
  accessibilityHint="Permanently deletes this match. This action cannot be undone."
/>
```

### 3. Announce Dynamic Changes

```typescript
import { AccessibilityInfo } from 'react-native';

const handleSave = async () => {
  try {
    await saveData();
    AccessibilityInfo.announceForAccessibility('Changes saved successfully');
  } catch (error) {
    AccessibilityInfo.announceForAccessibility('Error: Failed to save changes');
  }
};
```

### 4. Convey States Properly

```typescript
<Pressable
  accessibilityState={{
    disabled: isDisabled,
    selected: isSelected,
    busy: isLoading,
    checked: isChecked,
    expanded: isExpanded,
  }}
>
  {/* content */}
</Pressable>
```

### 5. Use Semantic Roles

```typescript
// Common roles:
accessibilityRole="button"      // For buttons
accessibilityRole="switch"      // For toggles
accessibilityRole="checkbox"    // For checkboxes
accessibilityRole="radio"       // For radio buttons
accessibilityRole="link"        // For links
accessibilityRole="text"        // For static text
accessibilityRole="header"      // For headers
accessibilityRole="search"      // For search inputs
```

## Testing Accessibility

### iOS (VoiceOver)

1. **Enable VoiceOver:**
   - Settings > Accessibility > VoiceOver > On
   - Or triple-click side button (if configured)

2. **Basic Gestures:**
   - Swipe right: Next element
   - Swipe left: Previous element
   - Double tap: Activate element
   - Two-finger swipe down: Read from current position

3. **What to Test:**
   - All interactive elements are announced
   - Labels are clear and descriptive
   - Actions are clearly described
   - States are properly announced (disabled, selected, etc.)
   - Navigation order is logical

### Android (TalkBack)

1. **Enable TalkBack:**
   - Settings > Accessibility > TalkBack > On
   - Or press both volume keys for 3 seconds

2. **Basic Gestures:**
   - Swipe right: Next element
   - Swipe left: Previous element
   - Double tap: Activate element
   - Swipe down then up: Read from top

3. **What to Test:**
   - Same as iOS VoiceOver testing

### Automated Testing

```typescript
import { render } from '@testing-library/react-native';

test('button has proper accessibility attributes', () => {
  const { getByRole } = render(
    <Button
      title="Submit"
      onPress={jest.fn()}
      accessibilityLabel="Submit form"
    />
  );

  const button = getByRole('button');
  expect(button).toHaveAccessibilityLabel('Submit form');
  expect(button).toHaveAccessibilityState({ disabled: false });
});
```

## Common Patterns

### Loading States
```typescript
<Button
  title="Save"
  loading={isSaving}
  accessibilityLabel="Save changes"
  accessibilityHint={isSaving ? "Saving in progress" : "Tap to save changes"}
/>
// accessibilityState.busy is automatically set when loading=true
```

### Error States
```typescript
<TextInput
  value={email}
  onChangeText={setEmail}
  accessibilityLabel="Email address"
  accessibilityInvalid={!!emailError}
  accessibilityHint={emailError || "Enter your email address"}
/>
```

### Success Feedback
```typescript
const handleSuccess = () => {
  triggerSuccessNotification(); // Haptic feedback
  AccessibilityInfo.announceForAccessibility('Success: Match created');
};
```

### Lists
```typescript
<FlatList
  data={matches}
  accessibilityLabel="Matches list"
  renderItem={({ item, index }) => (
    <Pressable
      accessibilityLabel={`Match ${index + 1}: ${item.name}`}
      accessibilityHint="Tap to view match details"
    >
      {/* content */}
    </Pressable>
  )}
/>
```

## Remaining Tasks

The following accessibility enhancements are recommended for future implementation:

### 1. Dynamic Text Sizing
- Respect user's font size preferences
- Support `allowFontScaling` on Text components
- Test with large text sizes

### 2. Color Blind Mode
- Provide high contrast themes
- Don't rely solely on color to convey information
- Add patterns or icons alongside colors

### 3. Accessibility Settings Screen
- Allow users to customize accessibility features
- Provide options for reduced motion
- Add high contrast mode toggle

### 4. Keyboard Navigation
- Support for external keyboards
- Proper focus management
- Visible focus indicators

### 5. Reduced Motion
- Respect `reduce motion` system setting
- Provide non-animated alternatives
- Disable parallax and complex animations when enabled

## Resources

- [React Native Accessibility Guide](https://reactnative.dev/docs/accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [iOS Accessibility Guidelines](https://developer.apple.com/accessibility/)
- [Android Accessibility Guidelines](https://developer.android.com/guide/topics/ui/accessibility)
- [Testing with Screen Readers](https://www.a11yproject.com/posts/getting-started-with-voiceover/)

## Summary

✅ **Completed:**
- Accessibility attributes on all interactive components
- Helper utilities for common patterns
- Proper roles, labels, hints, and states
- Test IDs for automated testing

🔄 **In Progress:**
- Screen reader testing
- Device testing with VoiceOver/TalkBack

📋 **Planned:**
- Dynamic text sizing
- Color blind mode
- Accessibility settings screen
- Reduced motion support

---

**Last Updated:** January 2025
**Status:** Core accessibility features implemented
**Next Steps:** Device testing and advanced features
