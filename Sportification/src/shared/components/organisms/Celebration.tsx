/**
 * Celebration Component
 * Displays celebration animation for achievements, milestones, and special moments
 * Uses Lottie animation with fallback to simple visual feedback
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Text } from 'react-native';
import { useTheme } from '../../theme';
import LottieView from 'lottie-react-native';
import { celebrationAnimation } from '../../assets/animations';
import { triggerSuccessNotification } from '../../utils/hapticFeedback';

interface CelebrationProps {
  visible: boolean;
  title?: string;
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

const Celebration: React.FC<CelebrationProps> = ({
  visible,
  title = 'Congratulations!',
  message,
  duration = 3000,
  onComplete,
}) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (visible) {
      // Trigger haptic feedback on celebration
      triggerSuccessNotification();

      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onComplete]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onComplete}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          {celebrationAnimation ? (
            <LottieView
              source={celebrationAnimation}
              autoPlay
              loop={false}
              style={styles.animation}
              onAnimationFinish={onComplete}
            />
          ) : (
            // Fallback: Simple emoji celebration
            <Text style={styles.fallbackEmoji}>🎉</Text>
          )}
          
          <Text style={[theme.typography.titleLarge, styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>
          
          {message && (
            <Text style={[theme.typography.bodyMedium, styles.message, { color: theme.colors.textSecondary }]}>
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 300,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  animation: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  fallbackEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Celebration;
