/**
 * Onboarding Permissions Screen
 * Request necessary permissions from user
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme';
import { Button } from '@shared/components/atoms';
import { Card } from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { triggerLightImpact, triggerSuccessNotification } from '@shared/utils/hapticFeedback';

interface OnboardingPermissionsScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const OnboardingPermissionsScreen: React.FC<OnboardingPermissionsScreenProps> = ({
  onNext,
  onBack,
  onSkip,
}) => {
  const { theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const handleEnableNotifications = async () => {
    triggerLightImpact();
    // In a real app, request notification permissions here
    // For now, just simulate success
    setNotificationsEnabled(true);
    triggerSuccessNotification();
  };

  const handleEnableLocation = async () => {
    triggerLightImpact();
    // In a real app, request location permissions here
    // For now, just simulate success
    setLocationEnabled(true);
    triggerSuccessNotification();
  };

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
      <View style={styles.content}>
        <Text
          style={[
            theme.typography.headlineLarge,
            { color: theme.colors.text, textAlign: 'center', marginBottom: theme.spacing.md },
          ]}
        >
          Enable Permissions
        </Text>
        <Text
          style={[
            theme.typography.bodyLarge,
            { color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing['2xl'] },
          ]}
        >
          Allow these permissions to get the most out of Sportification
        </Text>

        {/* Notifications Permission */}
        <Card
          variant="elevated"
          style={{ marginBottom: theme.spacing.base }}
        >
          <View style={styles.permissionCard}>
            <View
              style={[
                styles.permissionIcon,
                { backgroundColor: `${theme.colors.info}20` },
              ]}
            >
              <Icon name="bell" size={32} color={theme.colors.info} />
            </View>
            <View style={styles.permissionContent}>
              <Text style={[theme.typography.titleMedium, { color: theme.colors.text }]}>
                Notifications
              </Text>
              <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
                Get updates about your matches, tournaments, and messages
              </Text>
            </View>
          </View>
          <Button
            title={notificationsEnabled ? 'Enabled ✓' : 'Enable'}
            onPress={handleEnableNotifications}
            variant={notificationsEnabled ? 'secondary' : 'primary'}
            disabled={notificationsEnabled}
            fullWidth
            style={{ marginTop: theme.spacing.md }}
            accessibilityLabel="Enable notifications"
          />
        </Card>

        {/* Location Permission */}
        <Card
          variant="elevated"
          style={{ marginBottom: theme.spacing.base }}
        >
          <View style={styles.permissionCard}>
            <View
              style={[
                styles.permissionIcon,
                { backgroundColor: `${theme.colors.success}20` },
              ]}
            >
              <Icon name="map-marker" size={32} color={theme.colors.success} />
            </View>
            <View style={styles.permissionContent}>
              <Text style={[theme.typography.titleMedium, { color: theme.colors.text }]}>
                Location
              </Text>
              <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
                Find nearby venues and players in your area
              </Text>
            </View>
          </View>
          <Button
            title={locationEnabled ? 'Enabled ✓' : 'Enable'}
            onPress={handleEnableLocation}
            variant={locationEnabled ? 'secondary' : 'primary'}
            disabled={locationEnabled}
            fullWidth
            style={{ marginTop: theme.spacing.md }}
            accessibilityLabel="Enable location"
          />
        </Card>
      </View>

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
          accessibilityLabel="Skip permissions"
        />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.progressDot, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: theme.colors.primary }]} />
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
  content: {
    flex: 1,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  permissionIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionContent: {
    flex: 1,
  },
  actions: {
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

export default OnboardingPermissionsScreen;
