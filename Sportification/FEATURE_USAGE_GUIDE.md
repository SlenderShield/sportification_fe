# Feature Enhancements - Usage Examples

This document demonstrates how to use the newly implemented features from the backlog.

## Haptic Feedback

### Using in Custom Components

```typescript
import { triggerLightImpact, triggerSelection, triggerSuccessNotification } from '../utils/hapticFeedback';

// For button presses
const handlePress = () => {
  triggerLightImpact();
  // Your logic here
};

// For selections/toggles
const handleSelect = () => {
  triggerSelection();
  // Your logic here
};

// For success actions
const handleSuccess = () => {
  triggerSuccessNotification();
  // Your logic here
};
```

### Available Feedback Types

```typescript
import {
  triggerLightImpact,     // Light tap - for buttons, icons
  triggerMediumImpact,    // Medium tap - for important actions
  triggerHeavyImpact,     // Heavy tap - for critical actions
  triggerSelection,       // Selection - for toggles, chips
  triggerSuccessNotification,  // Success - for completions
  triggerErrorNotification,    // Error - for failures
  triggerWarningNotification,  // Warning - for cautions
} from '../utils/hapticFeedback';
```

## Lottie Animations

### Empty State with Lottie Animation

```typescript
import { EmptyState } from '../components/ui';
import { emptyMatchesAnimation } from '../assets/animations';

// With Lottie animation (when file is available)
<EmptyState
  title="No matches found"
  message="Create your first match to get started"
  lottieSource={emptyMatchesAnimation}
  lottieSize={200}
  lottieLoop={true}
/>

// Without Lottie (fallback to icon)
<EmptyState
  icon="soccer"
  title="No matches found"
  message="Create your first match to get started"
/>
```

### Celebration Component

```typescript
import { Celebration } from '../components/ui';
import { useCelebration } from '../hooks';

// Method 1: Using the component directly
const [showCelebration, setShowCelebration] = useState(false);

<Celebration
  visible={showCelebration}
  title="Match Won!"
  message="Congratulations on your victory!"
  duration={3000}
  onComplete={() => setShowCelebration(false)}
/>

// Method 2: Using the hook (recommended)
const { celebration, celebrate, hideCelebration } = useCelebration();

const handleWin = () => {
  celebrate('Match Won!', 'Congratulations on your victory!');
};

<Celebration
  visible={celebration.visible}
  title={celebration.title}
  message={celebration.message}
  onComplete={hideCelebration}
/>
```

### Adding Lottie Animation Files

1. Download Lottie JSON files from [LottieFiles](https://lottiefiles.com/)
2. Place them in `src/assets/animations/`
3. Uncomment the corresponding export in `src/assets/animations/index.ts`:

```typescript
// Before
export const celebrationAnimation = null;

// After
export const celebrationAnimation = require('./celebration.json');
```

4. Use in components:

```typescript
import { celebrationAnimation } from '../assets/animations';

// Check if animation is available
if (celebrationAnimation) {
  // Use Lottie animation
} else {
  // Use fallback
}
```

## Enhanced Components

### Button with Haptic Feedback (Automatic)

```typescript
import Button from '../components/common/Button';

// Haptic feedback is automatically triggered on press
<Button
  title="Submit"
  onPress={handleSubmit}
  variant="primary"
/>
```

### Chip with Haptic Feedback (Automatic)

```typescript
import { Chip } from '../components/ui';

// Haptic feedback is automatically triggered on selection
<Chip
  label="Football"
  selected={selected}
  onPress={handleSelect}
/>
```

### Toast with Haptic Feedback (Automatic)

```typescript
import { Toast, AnimatedToast } from '../components/ui';

// Haptic feedback is automatically triggered based on type
<Toast
  message="Success!"
  type="success"  // Triggers success haptic
  duration={3000}
/>

<AnimatedToast
  visible={true}
  type="error"  // Triggers error haptic
  message="Failed to save"
/>
```

## Common Use Cases

### Achievement System

```typescript
import { useCelebration } from '../hooks';
import { Celebration } from '../components/ui';

const AchievementScreen = () => {
  const { celebration, celebrate, hideCelebration } = useCelebration();

  const handleAchievement = (achievement: Achievement) => {
    celebrate(
      achievement.title,
      achievement.description,
      3000
    );
  };

  return (
    <View>
      {/* Your screen content */}
      
      <Celebration
        visible={celebration.visible}
        title={celebration.title}
        message={celebration.message}
        onComplete={hideCelebration}
      />
    </View>
  );
};
```

### Empty State with Animation

```typescript
import { EmptyState } from '../components/ui';
import { emptyMatchesAnimation } from '../assets/animations';

const MatchesScreen = () => {
  const { matches, loading } = useMatches();

  if (loading) return <LoadingScreen />;

  if (matches.length === 0) {
    return (
      <EmptyState
        lottieSource={emptyMatchesAnimation}
        lottieSize={200}
        title="No Matches Yet"
        message="Create your first match to get started!"
      />
    );
  }

  return <MatchList matches={matches} />;
};
```

### Success Feedback

```typescript
import { triggerSuccessNotification } from '../utils/hapticFeedback';
import { Toast } from '../components/ui';

const handleSubmit = async () => {
  try {
    await submitData();
    triggerSuccessNotification();
    showToast('Saved successfully!', 'success');
  } catch (error) {
    triggerErrorNotification();
    showToast('Failed to save', 'error');
  }
};
```

## Performance Considerations

### Haptic Feedback
- Automatically falls back to vibration on Android
- No-op on web/devices without haptic support
- Minimal performance impact

### Lottie Animations
- Use `loop={false}` for one-time animations (success, error)
- Use `loop={true}` for continuous animations (loading)
- Keep animation files under 50KB when possible
- Graceful fallback when animation files are not present

## Testing

### Testing Haptic Feedback
- Requires physical device (not available on simulator)
- Enable haptic feedback in device settings
- Test on both iOS and Android devices

### Testing Lottie Animations
- Works on simulators and physical devices
- Test with and without animation files
- Verify fallback behavior
- Check performance on lower-end devices

## Migration Guide

### Existing Components
All existing components continue to work without changes. New features are:
- **Additive**: Won't break existing functionality
- **Optional**: Can be adopted incrementally
- **Backward Compatible**: Fallbacks ensure graceful degradation

### Adopting New Features

1. **Add Haptic Feedback**: Already integrated in core components
2. **Add Lottie Animations**: 
   - Download animation files
   - Update animation index
   - Use in components
3. **Use Celebration Component**: Import and use in achievement flows
4. **Use Enhanced EmptyState**: Add `lottieSource` prop when ready

## Future Enhancements

The infrastructure is ready for:
- Onboarding animations (when onboarding screens are created)
- Custom screen transitions (via React Navigation configuration)
- Shared element transitions (via react-native-shared-element)
- Parallax effects (via Animated or Reanimated)

See `BACKLOG.md` for complete roadmap.

## Accessibility Features

### Enhanced Components with Accessibility

All interactive components now support accessibility attributes:

```typescript
import Button from '../components/common/Button';
import { IconButton, Chip, FAB } from '../components/ui';

// Button with accessibility
<Button
  title="Submit"
  onPress={handleSubmit}
  accessibilityLabel="Submit form"
  accessibilityHint="Saves your changes to the server"
  testID="submit-button"
/>

// IconButton with accessibility
<IconButton
  icon="close"
  onPress={handleClose}
  accessibilityLabel="Close dialog"
  accessibilityHint="Dismisses the current screen"
/>

// Chip with accessibility
<Chip
  label="Football"
  selected={true}
  onPress={handleSelect}
  accessibilityLabel="Football sport filter"
  accessibilityHint="Selected. Tap to deselect"
/>

// FAB with accessibility
<FAB
  icon="plus"
  onPress={handleAdd}
  accessibilityLabel="Create new match"
  accessibilityHint="Opens the match creation form"
/>
```

### Using Accessibility Utilities

```typescript
import {
  getButtonAccessibilityProps,
  getToggleAccessibilityProps,
  getFormFieldLabel,
  createAccessibilityAnnouncement,
} from '../utils/accessibility';
import { AccessibilityInfo } from 'react-native';

// Button props
const buttonProps = getButtonAccessibilityProps(
  'Save Changes',
  'Saves your profile information',
  isDisabled,
  isSaving
);

<Pressable {...buttonProps} onPress={handleSave}>
  <Text>Save</Text>
</Pressable>

// Toggle props
const toggleProps = getToggleAccessibilityProps(
  'Dark Mode',
  isDarkMode,
  false
);

<Switch {...toggleProps} value={isDarkMode} onChange={handleToggle} />

// Form field label
const emailLabel = getFormFieldLabel('Email', true, currentEmail);
// Returns: "Email, required, current value: user@example.com"

// Announce to screen readers
const handleSuccess = () => {
  const message = createAccessibilityAnnouncement('success', 'Profile saved');
  AccessibilityInfo.announceForAccessibility(message);
};
```

### Accessibility Best Practices

```typescript
// 1. Always provide meaningful labels
<IconButton
  icon="delete"
  onPress={handleDelete}
  accessibilityLabel="Delete match"  // Good
  // Not just "delete" or relying on icon alone
/>

// 2. Add context with hints
<Button
  title="Delete"
  onPress={handleDelete}
  accessibilityHint="Permanently deletes this match. Cannot be undone."
/>

// 3. Announce dynamic changes
const handleSave = async () => {
  try {
    await saveData();
    AccessibilityInfo.announceForAccessibility('Changes saved successfully');
  } catch (error) {
    AccessibilityInfo.announceForAccessibility('Error: Failed to save');
  }
};

// 4. Use proper states
<Pressable
  accessibilityState={{
    disabled: isDisabled,
    selected: isSelected,
    busy: isLoading,
  }}
>
  {/* content */}
</Pressable>
```

See `ACCESSIBILITY_GUIDE.md` for comprehensive accessibility documentation.
