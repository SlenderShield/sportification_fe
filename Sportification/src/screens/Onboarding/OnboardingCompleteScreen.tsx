/**
 * Onboarding Complete Screen
 * Final screen of onboarding flow
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme';
import Button from '../../components/common/Button';
import { triggerSuccessNotification } from '../../utils/hapticFeedback';

const { width } = Dimensions.get('window');

interface OnboardingCompleteScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const OnboardingCompleteScreen: React.FC<OnboardingCompleteScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const { theme } = useTheme();

  const handleComplete = () => {
    triggerSuccessNotification();
    onComplete();
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Success Illustration */}
      <View style={styles.illustrationContainer}>
        <View
          style={[
            styles.illustrationPlaceholder,
            { backgroundColor: theme.colors.successContainer },
          ]}
        >
          <Text style={[theme.typography.displayLarge, { fontSize: 80 }]}>
            🎉
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            theme.typography.headlineLarge,
            { color: theme.colors.text, textAlign: 'center', marginBottom: theme.spacing.md },
          ]}
        >
          You're All Set!
        </Text>
        <Text
          style={[
            theme.typography.bodyLarge,
            { color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing['2xl'] },
          ]}
        >
          Start organizing matches, building teams, and connecting with players in your community.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Start Exploring"
          onPress={handleComplete}
          variant="primary"
          fullWidth
          accessibilityLabel="Complete onboarding"
          accessibilityHint="Completes onboarding and goes to main app"
        />
        <Button
          title="Back"
          onPress={handleBack}
          variant="text"
          fullWidth
          style={{ marginTop: theme.spacing.md }}
          accessibilityLabel="Go back"
        />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.progressDot, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.progressDot, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: theme.colors.primary }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationPlaceholder: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingVertical: 32,
  },
  actions: {
    marginBottom: 32,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    width: 24,
  },
});

export default OnboardingCompleteScreen;
