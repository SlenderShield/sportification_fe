// Animation configurations
export const animations = {
  // Duration in milliseconds
  duration: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },

  // Easing curves
  easing: {
    // Standard easing
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    // Emphasized easing for important transitions
    emphasized: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    // Decelerate easing for entering animations
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    // Accelerate easing for exiting animations
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    // Sharp easing for quick transitions
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
  },

  // Spring configurations for react-native-reanimated
  spring: {
    gentle: {
      damping: 20,
      stiffness: 90,
      mass: 1,
    },
    smooth: {
      damping: 15,
      stiffness: 100,
      mass: 0.8,
    },
    snappy: {
      damping: 12,
      stiffness: 150,
      mass: 0.6,
    },
    bouncy: {
      damping: 8,
      stiffness: 100,
      mass: 0.5,
    },
  },

  // Timing configurations
  timing: {
    fast: { duration: 150 },
    normal: { duration: 250 },
    slow: { duration: 350 },
  },
};

export type Animations = typeof animations;
