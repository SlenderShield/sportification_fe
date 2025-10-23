/**
 * Onboarding Welcome Screen
 * First screen of the onboarding flow
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme';
import { Button } from '@shared/components/atoms';
import { triggerLightImpact } from '@shared/utils/hapticFeedback';

const { width } = Dimensions.get('window');

interface OnboardingWelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({
  onNext,
  onSkip,
}) => {
  const { theme } = useTheme();

  const handleNext = () => {
    triggerLightImpact();
    onNext();
  };

  const handleSkip = () => {
    triggerLightImpact();
    onSkip();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Illustration/Logo Area */}
      <View style={styles.illustrationContainer}>
        <View
          style={[
            styles.illustrationPlaceholder,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Text style={[theme.typography.displayLarge, { color: theme.colors.primary }]}>
            ⚽
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
          Welcome to Sportification
        </Text>
        <Text
          style={[
            theme.typography.bodyLarge,
            { color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing['2xl'] },
          ]}
        >
          Organize matches, tournaments, and teams with ease. Connect with players and venues in your area.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Get Started"
          onPress={handleNext}
          variant="primary"
          fullWidth
          accessibilityLabel="Get started with onboarding"
          accessibilityHint="Proceeds to the next onboarding screen"
        />
        <Button
          title="Skip"
          onPress={handleSkip}
          variant="text"
          fullWidth
          style={{ marginTop: theme.spacing.md }}
          accessibilityLabel="Skip onboarding"
          accessibilityHint="Skips onboarding and goes to main app"
        />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.progressDot, { backgroundColor: theme.colors.outline }]} />
        <View style={[styles.progressDot, { backgroundColor: theme.colors.outline }]} />
        <View style={[styles.progressDot, { backgroundColor: theme.colors.outline }]} />
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

export default OnboardingWelcomeScreen;
