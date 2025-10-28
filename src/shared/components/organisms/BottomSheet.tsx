import React, { ReactNode, useEffect } from 'react';
import { StyleSheet, View, Pressable, Modal, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: number;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  height = SCREEN_HEIGHT * 0.6,
}) => {
  const { theme } = useTheme();
  const translateY = useSharedValue(height);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, theme.animations.spring.smooth);
      backdropOpacity.value = withTiming(1, {
        duration: theme.animations.duration.normal,
      });
    } else {
      translateY.value = withSpring(height, theme.animations.spring.smooth);
      backdropOpacity.value = withTiming(0, {
        duration: theme.animations.duration.normal,
      });
    }
    // All dependencies are stable shared values and theme constants
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  const handleBackdropPress = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              height,
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: theme.borderRadius.xl,
              borderTopRightRadius: theme.borderRadius.xl,
            },
            animatedSheetStyle,
          ]}
        >
          <View
            style={[
              styles.handle,
              {
                backgroundColor: theme.colors.outline,
                borderRadius: theme.borderRadius.xs,
                marginTop: theme.spacing.md,
                marginBottom: theme.spacing.base,
              },
            ]}
          />
          <View style={{ flex: 1, padding: theme.spacing.base }}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    width: '100%',
  },
  handle: {
    width: 40,
    height: 4,
    alignSelf: 'center',
  },
});

export default BottomSheet;
