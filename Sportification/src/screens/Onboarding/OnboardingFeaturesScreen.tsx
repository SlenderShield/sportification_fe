/**
 * Onboarding Features Screen
 * Highlights key features of the app
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme';
import { Button } from '@shared/components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { triggerLightImpact } from '@shared/utils/hapticFeedback';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface OnboardingFeaturesScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const OnboardingFeaturesScreen: React.FC<OnboardingFeaturesScreenProps> = ({
  onNext,
  onBack,
  onSkip,
}) => {
  const { theme } = useTheme();

  const features: Feature[] = [
    {
      icon: 'soccer',
      title: 'Organize Matches',
      description: 'Create and manage matches with friends, set dates, times, and venues effortlessly.',
      color: theme.colors.primary,
    },
    {
      icon: 'trophy',
      title: 'Run Tournaments',
      description: 'Set up tournaments, track standings, and crown champions in your community.',
      color: theme.colors.secondary,
    },
    {
      icon: 'account-group',
      title: 'Build Teams',
      description: 'Create teams, invite players, and manage your squad all in one place.',
      color: theme.colors.tertiary,
    },
    {
      icon: 'map-marker',
      title: 'Find Venues',
      description: 'Discover and book sports venues near you for your matches and events.',
      color: theme.colors.success,
    },
  ];

  const handleNext = () => {
    triggerLightImpact();
    onNext();
  };

  const handleBack = () => {
    triggerLightImpact();
    onBack();
  };

  const handleSkip = () => {
    triggerLightImpact();
    onSkip();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            theme.typography.headlineLarge,
            { color: theme.colors.text, textAlign: 'center', marginBottom: theme.spacing.xl },
          ]}
        >
          Everything You Need
        </Text>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${feature.color}20` },
                ]}
              >
                <Icon name={feature.icon} size={40} color={feature.color} />
              </View>
              <View style={styles.featureContent}>
                <Text
                  style={[
                    theme.typography.titleMedium,
                    { color: theme.colors.text, marginBottom: theme.spacing.xs },
                  ]}
                >
                  {feature.title}
                </Text>
                <Text
                  style={[
                    theme.typography.bodyMedium,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.buttonRow}>
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={{ flex: 1, marginRight: theme.spacing.sm }}
            accessibilityLabel="Go back"
          />
          <Button
            title="Next"
            onPress={handleNext}
            variant="primary"
            style={{ flex: 1, marginLeft: theme.spacing.sm }}
            accessibilityLabel="Continue to next screen"
          />
        </View>
        <Button
          title="Skip"
          onPress={handleSkip}
          variant="text"
          fullWidth
          style={{ marginTop: theme.spacing.md }}
          accessibilityLabel="Skip onboarding"
        />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: theme.colors.primary }]} />
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
  scrollView: {
    flex: 1,
  },
  featuresContainer: {
    gap: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  actions: {
    marginTop: 32,
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
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

export default OnboardingFeaturesScreen;
