/**
 * Offline Indicator Component
 * Shows network status indicator at the top of the screen
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { useNetworkStatus } from '../../utils/offline';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface OfflineIndicatorProps {
  showWhenOnline?: boolean; // Show success message briefly when back online
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  showWhenOnline = true,
}) => {
  const { theme } = useTheme();
  const { isFullyOnline } = useNetworkStatus();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!isFullyOnline) {
      // Show offline indicator
      translateY.value = withSpring(0, theme.animations.spring.smooth);
      opacity.value = withTiming(1, { duration: theme.animations.duration.normal });
    } else {
      if (showWhenOnline) {
        // Show "back online" message briefly
        translateY.value = withSpring(0, theme.animations.spring.smooth);
        opacity.value = withTiming(1, { duration: theme.animations.duration.fast });
        
        setTimeout(() => {
          translateY.value = withSpring(-100, theme.animations.spring.smooth);
          opacity.value = withTiming(0, { duration: theme.animations.duration.normal });
        }, 2000);
      } else {
        // Hide immediately
        translateY.value = withSpring(-100, theme.animations.spring.smooth);
        opacity.value = withTiming(0, { duration: theme.animations.duration.normal });
      }
    }
  }, [isFullyOnline]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isFullyOnline ? theme.colors.success : theme.colors.error,
        },
        animatedStyle,
      ]}
    >
      <Icon
        name={isFullyOnline ? 'wifi-check' : 'wifi-off'}
        size={20}
        color={theme.colors.onError}
        style={{ marginRight: theme.spacing.sm }}
      />
      <Text
        style={[
          theme.typography.labelMedium,
          { color: theme.colors.onError, fontWeight: '600' },
        ]}
      >
        {isFullyOnline ? 'Back Online' : 'No Internet Connection'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default OfflineIndicator;
