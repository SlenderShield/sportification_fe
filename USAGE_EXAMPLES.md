# Performance and Accessibility Features Usage Examples

This document provides practical examples of using the new performance and accessibility features.

## Image Optimization Examples

### Basic OptimizedImage Usage

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OptimizedImage } from '../components/ui';

const ProfileAvatar = ({ imageUrl }) => {
  return (
    <OptimizedImage
      source={{ uri: imageUrl }}
      style={styles.avatar}
      placeholder
      placeholderColor="#E0E0E0"
      fadeInDuration={300}
      cacheEnabled
      resizeMode="cover"
      onLoadEnd={() => console.log('Image loaded')}
      onError={() => console.log('Image failed to load')}
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
```

### Image Preloading

```typescript
import React, { useEffect } from 'react';
import { preloadImages, preloadImagesWithProgress } from '../utils/imageOptimization';

const GalleryScreen = ({ images }) => {
  useEffect(() => {
    // Simple preload
    preloadImages(images.map(img => img.url));

    // Or with progress tracking
    preloadImagesWithProgress(
      images.map(img => img.url),
      (loaded, total) => {
        console.log(`Loading: ${loaded}/${total}`);
        setLoadingProgress(loaded / total);
      }
    );
  }, [images]);

  return (
    // Gallery UI
  );
};
```

### Responsive Image URLs

```typescript
import { getOptimizedImageUrl, getResponsiveImageSources } from '../utils/imageOptimization';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// Single optimized URL
const thumbnailUrl = getOptimizedImageUrl(
  originalImageUrl,
  200,  // width
  80    // quality
);

// Multiple sizes for different densities
const sources = getResponsiveImageSources(
  originalImageUrl,
  [screenWidth * 1, screenWidth * 2, screenWidth * 3]
);

// Use appropriate source based on pixel density
<OptimizedImage source={{ uri: sources[screenWidth * 2] }} />
```

## Accessibility Examples

### Using Accessibility Settings

```typescript
import React from 'react';
import { Text, View } from 'react-native';
import { useAccessibility, getScaledFontSize } from '../contexts/AccessibilityContext';
import { useTheme } from '../theme';

const AccessibleText = ({ children }) => {
  const { settings } = useAccessibility();
  const { theme } = useTheme();

  // Get scaled font size
  const fontSize = getScaledFontSize(16, settings.fontScale);

  // Use bold text if system setting is enabled (iOS)
  const fontWeight = settings.boldTextEnabled ? '600' : '400';

  return (
    <Text
      allowFontScaling  // Always enable for accessibility
      style={{
        fontSize,
        fontWeight,
        color: theme.colors.text, // Auto-adjusts for high contrast
      }}
    >
      {children}
    </Text>
  );
};
```

### High Contrast Mode

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme';
import { useAccessibility } from '../contexts/AccessibilityContext';

const AccessibleButton = ({ title, onPress }) => {
  const { theme } = useTheme();
  const { settings } = useAccessibility();

  // Theme automatically adjusts colors for high contrast
  // But you can check if needed for custom logic
  const borderWidth = settings.highContrastMode ? 2 : 1;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.outline,
        borderWidth,
        padding: 16,
        borderRadius: 8,
      }}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text
        allowFontScaling
        style={{
          color: theme.colors.onPrimary,
          fontSize: 16,
          fontWeight: '600',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

### Reduced Motion Support

```typescript
import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAnimationConfig } from '../hooks';

const AnimatedCard = ({ children }) => {
  const { duration, shouldAnimate } = useAnimationConfig();

  return (
    <Animated.View
      // Only animate if shouldAnimate is true
      entering={shouldAnimate ? FadeIn.duration(duration.normal) : undefined}
      exiting={shouldAnimate ? FadeOut.duration(duration.fast) : undefined}
    >
      {children}
    </Animated.View>
  );
};
```

### Complete Accessible Component Example

```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../theme';
import { useAccessibility, getScaledFontSize } from '../contexts/AccessibilityContext';
import { useAnimationConfig } from '../hooks';
import { OptimizedImage } from '../components/ui';

interface ProfileCardProps {
  name: string;
  avatarUrl: string;
  bio: string;
  onPress: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  avatarUrl,
  bio,
  onPress,
}) => {
  const { theme } = useTheme();
  const { settings } = useAccessibility();
  const { duration, shouldAnimate, spring } = useAnimationConfig();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Scale fonts based on user preference
  const nameSize = getScaledFontSize(20, settings.fontScale);
  const bioSize = getScaledFontSize(14, settings.fontScale);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      // Enhanced border for high contrast
      borderWidth: settings.highContrastMode ? 2 : 1,
      borderColor: theme.colors.outline,
      ...theme.elevation.small,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: theme.spacing.md,
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: nameSize,
      fontWeight: settings.boldTextEnabled ? '700' : '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    bio: {
      fontSize: bioSize,
      color: theme.colors.textSecondary,
      lineHeight: bioSize * 1.4,
    },
  });

  const AnimatedCard = shouldAnimate ? Animated.View : View;
  const animationProps = shouldAnimate
    ? {
        entering: FadeInDown.duration(duration.normal).springify(),
      }
    : {};

  return (
    <AnimatedCard {...animationProps}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.card}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${name}'s profile`}
        accessibilityHint="Tap to view full profile"
        accessibilityState={{ disabled: false }}
      >
        <View style={styles.content}>
          <OptimizedImage
            source={{ uri: avatarUrl }}
            style={styles.avatar}
            placeholder
            placeholderColor={theme.colors.surfaceVariant}
            fadeInDuration={duration.normal}
            cacheEnabled
            onLoadEnd={() => setImageLoaded(true)}
          />
          <View style={styles.info}>
            <Text
              allowFontScaling
              style={styles.name}
              numberOfLines={1}
              accessibilityRole="text"
            >
              {name}
            </Text>
            <Text
              allowFontScaling
              style={styles.bio}
              numberOfLines={2}
              accessibilityRole="text"
            >
              {bio}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </AnimatedCard>
  );
};

export default ProfileCard;
```

## Testing Examples

### Testing with Different Accessibility Settings

```typescript
// In your test or dev mode
import { AccessibilityProvider } from '../contexts/AccessibilityContext';

// Test with large text
<AccessibilityProvider
  initialSettings={{
    fontScale: 1.5,
    allowFontScaling: true,
  }}
>
  <YourComponent />
</AccessibilityProvider>

// Test with high contrast
<AccessibilityProvider
  initialSettings={{
    highContrastMode: true,
  }}
>
  <YourComponent />
</AccessibilityProvider>

// Test with reduced motion
<AccessibilityProvider
  initialSettings={{
    reduceMotion: true,
  }}
>
  <YourComponent />
</AccessibilityProvider>
```

### Manual Testing Checklist

#### Image Performance:
1. Check image loading indicators appear
2. Verify images fade in smoothly
3. Check cached images load instantly
4. Test error states for broken images
5. Verify memory usage doesn't spike

#### Text Scaling:
1. Go to Settings → Accessibility
2. Try each text size option
3. Check all screens for layout issues
4. Verify text remains readable
5. Check buttons and inputs scale properly

#### High Contrast:
1. Enable high contrast mode
2. Check all text is readable
3. Verify borders are visible
4. Check button states are clear
5. Test with both light and dark themes

#### Reduced Motion:
1. Enable reduced motion
2. Navigate through app
3. Verify animations are minimal
4. Check essential feedback remains
5. Test transitions between screens

#### Screen Reader:
1. Enable VoiceOver (iOS) or TalkBack (Android)
2. Navigate using swipe gestures
3. Verify all elements are announced
4. Check interactive elements work
5. Test form inputs and buttons

## Best Practices Summary

### Images:
✅ Always use OptimizedImage for remote images  
✅ Preload critical images on screen mount  
✅ Use appropriate image sizes for context  
✅ Provide meaningful placeholders  
✅ Handle loading and error states  

### Text:
✅ Always set allowFontScaling={true}  
✅ Use getScaledFontSize for custom sizes  
✅ Test with maximum font scale (1.5x)  
✅ Ensure line heights scale proportionally  
✅ Check multi-line text doesn't overflow  

### Colors:
✅ Use theme colors instead of hardcoded values  
✅ Theme automatically handles high contrast  
✅ Test with both light and dark themes  
✅ Ensure sufficient contrast ratios  
✅ Don't rely solely on color for information  

### Animations:
✅ Use useAnimationConfig hook  
✅ Check shouldAnimate before animating  
✅ Keep essential feedback even with reduced motion  
✅ Test with reduced motion enabled  
✅ Use faster durations for reduced motion  

### Accessibility:
✅ Add accessibilityLabel to all interactive elements  
✅ Add accessibilityHint for context  
✅ Set accessibilityRole appropriately  
✅ Update accessibilityState when state changes  
✅ Test with screen readers enabled  

## Common Patterns

### Loading State with Accessibility
```typescript
const [loading, setLoading] = useState(true);

return (
  <View
    accessibilityRole="button"
    accessibilityLabel="Submit form"
    accessibilityState={{ busy: loading }}
    accessibilityHint={loading ? "Submitting..." : "Tap to submit"}
  >
    {loading ? <ActivityIndicator /> : <Text>Submit</Text>}
  </View>
);
```

### Accessible Form Input
```typescript
const [value, setValue] = useState('');
const [error, setError] = useState('');

return (
  <TextInput
    value={value}
    onChangeText={setValue}
    allowFontScaling
    accessibilityLabel="Email address"
    accessibilityHint={error || "Enter your email"}
    accessibilityInvalid={!!error}
    style={{ fontSize: getScaledFontSize(16, settings.fontScale) }}
  />
);
```

### Accessible List
```typescript
<FlatList
  data={items}
  accessibilityLabel="Items list"
  renderItem={({ item, index }) => (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Item ${index + 1}: ${item.name}`}
      accessibilityHint="Tap to view details"
    >
      <Text allowFontScaling>{item.name}</Text>
    </TouchableOpacity>
  )}
/>
```

---

For more information, see [PERFORMANCE_ACCESSIBILITY_GUIDE.md](./PERFORMANCE_ACCESSIBILITY_GUIDE.md)
