# Tablet and iPad Support Guide

This app is optimized for both phones and tablets (including iPads).

## Device Detection

The app automatically detects the device type and adjusts layouts accordingly:

- **iOS**: Uses `Platform.isPad` to detect iPads
- **Android**: Uses screen dimensions (width/height >= 600dp) to detect tablets

## Responsive Utilities

Located in `src/utils/responsive.ts`:

### Functions

- `getDeviceType()` - Returns 'phone' or 'tablet'
- `isTablet()` - Boolean check for tablet devices
- `getResponsiveValue(phoneValue, tabletValue)` - Returns appropriate value based on device
- `useResponsiveFontSize()` - Scaled font sizes (1.3x for tablets)
- `useResponsiveSpacing()` - Scaled spacing (1.5x for tablets)
- `getOrientation()` - Returns 'landscape' or 'portrait'
- `useResponsiveLayout()` - Complete layout helper with device info and column counts

## Usage Examples

### Basic Responsive Sizing

```typescript
import { getResponsiveValue } from '../utils/responsive';

const styles = StyleSheet.create({
  container: {
    padding: getResponsiveValue(16, 24),
  },
});
```

### Responsive Fonts

```typescript
import { useResponsiveFontSize } from '../utils/responsive';

const MyComponent = () => {
  const fontSize = useResponsiveFontSize();

  return (
    <View>
      <Text style={{ fontSize: fontSize.large }}>Heading</Text>
      <Text style={{ fontSize: fontSize.medium }}>Body text</Text>
    </View>
  );
};
```

### Adaptive Layouts

```typescript
import { useResponsiveLayout } from '../utils/responsive';

const MyScreen = () => {
  const layout = useResponsiveLayout();

  return (
    <FlatList
      data={items}
      numColumns={layout.numColumns}
      key={layout.numColumns} // Important: Re-render when columns change
      contentContainerStyle={{
        maxWidth: layout.contentMaxWidth,
        alignSelf: 'center',
      }}
    />
  );
};
```

### Orientation-Aware UI

```typescript
import { getOrientation } from '../utils/responsive';

const MyComponent = () => {
  const orientation = getOrientation();

  return (
    <View style={{
      flexDirection: orientation === 'landscape' ? 'row' : 'column'
    }}>
      {/* Content */}
    </View>
  );
};
```

## Best Practices

1. **Always use responsive utilities** instead of hardcoded values
2. **Test on both orientations** - Use device rotation in simulator/emulator
3. **Consider content hierarchy** - Tablets can show more information per screen
4. **Touch targets** - Maintain at least 44x44 points for touch targets on all devices
5. **Use FlatList numColumns** - Leverage multi-column layouts on tablets
6. **Safe areas** - Always use SafeAreaView for notched devices

## Testing

### iOS Simulators
```bash
# iPhone
npm run ios

# iPad Pro 12.9"
npm run ios:ipad

# Other iPads
react-native run-ios --simulator="iPad Air"
react-native run-ios --simulator="iPad mini"
```

### Android Emulators
```bash
# Create tablet AVD in Android Studio with:
# - Screen size: 10.1" or larger
# - Resolution: 1920x1200 or higher

npm run android
```

## Screen Size Categories

- **Phone**: < 600dp
- **Tablet (7-10")**: 600dp - 900dp  
- **Tablet (10"+)**: > 900dp

## Navigation Considerations

On tablets in landscape:
- Consider using split-view or master-detail patterns
- Bottom tabs work well, but side navigation can be more efficient
- Modal screens can use larger widths (not full screen)

## Platform-Specific Notes

### iOS
- iPad has unique interactions (slide over, split view)
- Support both portrait and landscape orientations
- Use adaptive layouts that work in multitasking modes

### Android
- Support multiple screen densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- Test on various Android tablet manufacturers
- Consider foldable devices for future compatibility

## Troubleshooting

**Issue**: Layout doesn't update when rotating device
**Solution**: Make sure to use `key` prop on FlatList when numColumns changes

**Issue**: Text too small on tablets
**Solution**: Use `useResponsiveFontSize()` instead of hardcoded sizes

**Issue**: Touch targets too small
**Solution**: Use `useResponsiveSpacing()` for padding/margins around touchable elements
