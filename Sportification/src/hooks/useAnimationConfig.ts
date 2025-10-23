import { useAccessibility } from '../contexts/AccessibilityContext';
import { animations } from '../theme/animations';

/**
 * useAnimationConfig Hook
 * 
 * Returns animation configurations that respect the user's reduced motion preference.
 * When reduced motion is enabled, animations are either disabled or significantly reduced.
 * 
 * @returns Object with animation durations and configs
 * 
 * @example
 * ```typescript
 * const { duration, shouldAnimate } = useAnimationConfig();
 * 
 * // Use in animated component
 * <Animated.View
 *   entering={shouldAnimate ? FadeIn.duration(duration.normal) : undefined}
 * >
 *   {content}
 * </Animated.View>
 * 
 * // Use in timing animation
 * Animated.timing(value, {
 *   toValue: 1,
 *   duration: duration.normal,
 *   useNativeDriver: true,
 * }).start();
 * ```
 */
export const useAnimationConfig = () => {
  const { settings } = useAccessibility();
  const reduceMotion = settings.reduceMotion;

  // When reduced motion is enabled, use instant durations
  // or very fast durations for essential feedback
  const duration = {
    instant: 0,
    fast: reduceMotion ? 50 : animations.duration.fast,
    normal: reduceMotion ? 100 : animations.duration.normal,
    slow: reduceMotion ? 150 : animations.duration.slow,
    slower: reduceMotion ? 200 : animations.duration.slower,
  };

  // Spring configs with reduced motion
  const spring = {
    gentle: reduceMotion
      ? { damping: 40, stiffness: 200, mass: 0.5 } // Much faster, less bouncy
      : animations.spring.gentle,
    smooth: reduceMotion
      ? { damping: 35, stiffness: 200, mass: 0.4 }
      : animations.spring.smooth,
    snappy: reduceMotion
      ? { damping: 30, stiffness: 250, mass: 0.3 }
      : animations.spring.snappy,
    bouncy: reduceMotion
      ? { damping: 30, stiffness: 200, mass: 0.3 } // No bounce when reduced
      : animations.spring.bouncy,
  };

  // Timing configs with reduced motion
  const timing = {
    fast: { duration: duration.fast },
    normal: { duration: duration.normal },
    slow: { duration: duration.slow },
  };

  return {
    duration,
    spring,
    timing,
    // Helpful flag to check if animations should be shown
    shouldAnimate: !reduceMotion,
    // For complete disabling of decorative animations
    shouldAnimateDecorative: false, // Decorative animations always off in reduced motion
  };
};

/**
 * getAnimationDuration
 * 
 * Helper function to get animation duration based on reduced motion setting.
 * Can be used outside of React components.
 * 
 * @param normalDuration - Normal duration in ms
 * @param reduceMotion - Whether reduced motion is enabled
 * @returns Adjusted duration in ms
 */
export const getAnimationDuration = (
  normalDuration: number,
  reduceMotion: boolean = false
): number => {
  if (reduceMotion) {
    // Reduce to 20% of normal duration, minimum 50ms for essential feedback
    return Math.max(normalDuration * 0.2, 50);
  }
  return normalDuration;
};

/**
 * getSpringConfig
 * 
 * Helper function to get spring config based on reduced motion setting.
 * 
 * @param config - Normal spring config
 * @param reduceMotion - Whether reduced motion is enabled
 * @returns Adjusted spring config
 */
export const getSpringConfig = (
  config: { damping: number; stiffness: number; mass: number },
  reduceMotion: boolean = false
): { damping: number; stiffness: number; mass: number } => {
  if (reduceMotion) {
    return {
      damping: Math.max(config.damping * 2, 30), // More damping = less bounce
      stiffness: Math.min(config.stiffness * 2, 250), // More stiffness = faster
      mass: Math.max(config.mass * 0.5, 0.3), // Less mass = faster
    };
  }
  return config;
};
