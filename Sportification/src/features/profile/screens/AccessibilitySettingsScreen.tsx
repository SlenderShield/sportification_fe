import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Ionicons } from '@expo/vector-icons';
import { SectionHeader, Divider } from '../../components/ui';

/**
 * AccessibilitySettingsScreen
 * 
 * Allows users to customize accessibility features:
 * - Dynamic text sizing
 * - High contrast mode
 * - Reduced motion
 * - Bold text (system setting)
 * 
 * Note: Some settings are controlled by the system and cannot be changed in-app.
 */
const AccessibilitySettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { settings, updateSetting, resetSettings } = useAccessibility();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    settingInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.xs,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 20,
    },
    systemBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
      paddingVertical: theme.spacing.xxs,
      paddingHorizontal: theme.spacing.xs,
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: theme.borderRadius.sm,
      alignSelf: 'flex-start',
    },
    systemBadgeText: {
      fontSize: 12,
      color: theme.colors.onPrimaryContainer,
      marginLeft: theme.spacing.xxs,
    },
    fontScaleContainer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    fontScaleOptions: {
      marginTop: theme.spacing.md,
    },
    fontScaleOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.xs,
    },
    fontScaleOptionSelected: {
      backgroundColor: theme.colors.primaryContainer,
    },
    fontScaleLabel: {
      fontSize: 16,
      color: theme.colors.onSurface,
    },
    fontScaleValue: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    resetButton: {
      margin: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.errorContainer,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    resetButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.onErrorContainer,
    },
    infoBox: {
      margin: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    infoIcon: {
      marginRight: theme.spacing.sm,
      marginTop: 2,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 20,
    },
  });

  const fontScaleOptions = [
    { label: 'Small', value: 0.85, description: 'Smaller text size' },
    { label: 'Default', value: 1.0, description: 'Standard text size' },
    { label: 'Large', value: 1.15, description: 'Larger text size' },
    { label: 'Extra Large', value: 1.3, description: 'Much larger text' },
    { label: 'Accessibility', value: 1.5, description: 'Maximum text size' },
  ];

  const handleResetSettings = async () => {
    await resetSettings();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle"
            size={24}
            color={theme.colors.primary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText} allowFontScaling>
            These settings help make the app more accessible. Some features are
            controlled by your device's system settings.
          </Text>
        </View>

        {/* Text Sizing */}
        <SectionHeader title="Text Size" />
        <View style={styles.fontScaleContainer}>
          <Text style={styles.settingDescription} allowFontScaling>
            Adjust the text size throughout the app. This affects all text
            elements that support scaling.
          </Text>

          <View style={styles.fontScaleOptions}>
            {fontScaleOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.fontScaleOption,
                  settings.fontScale === option.value &&
                    styles.fontScaleOptionSelected,
                ]}
                onPress={() => updateSetting('fontScale', option.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: settings.fontScale === option.value }}
                accessibilityLabel={`${option.label} text size, ${option.description}`}
              >
                <View>
                  <Text
                    style={[
                      styles.fontScaleLabel,
                      { fontSize: 16 * option.value },
                    ]}
                    allowFontScaling={false}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.fontScaleValue} allowFontScaling>
                    {option.description}
                  </Text>
                </View>
                {settings.fontScale === option.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Divider />

        {/* Visual Settings */}
        <SectionHeader title="Visual" />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle} allowFontScaling>
              High Contrast Mode
            </Text>
            <Text style={styles.settingDescription} allowFontScaling>
              Increases contrast between text and backgrounds for better
              visibility. Helpful for color blindness and low vision.
            </Text>
          </View>
          <Switch
            value={settings.highContrastMode}
            onValueChange={(value) => updateSetting('highContrastMode', value)}
            trackColor={{
              false: theme.colors.surfaceVariant,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.surface}
            accessibilityRole="switch"
            accessibilityLabel="High contrast mode"
            accessibilityState={{ checked: settings.highContrastMode }}
          />
        </View>

        <Divider />

        {/* Motion Settings */}
        <SectionHeader title="Motion" />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle} allowFontScaling>
              Reduce Motion
            </Text>
            <Text style={styles.settingDescription} allowFontScaling>
              Minimizes animations and motion effects. Reduces animations that
              may cause discomfort.
            </Text>
            {Platform.OS === 'ios' && settings.reduceMotion && (
              <View style={styles.systemBadge}>
                <Ionicons
                  name="phone-portrait"
                  size={12}
                  color={theme.colors.onPrimaryContainer}
                />
                <Text style={styles.systemBadgeText} allowFontScaling={false}>
                  System Setting
                </Text>
              </View>
            )}
          </View>
          <Switch
            value={settings.reduceMotion}
            onValueChange={(value) => updateSetting('reduceMotion', value)}
            trackColor={{
              false: theme.colors.surfaceVariant,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.surface}
            disabled={Platform.OS === 'ios'}
            accessibilityRole="switch"
            accessibilityLabel="Reduce motion"
            accessibilityState={{ checked: settings.reduceMotion }}
            accessibilityHint={
              Platform.OS === 'ios'
                ? 'Controlled by system settings'
                : 'Tap to toggle'
            }
          />
        </View>

        <Divider />

        {/* Screen Reader Status */}
        <SectionHeader title="Screen Reader" />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle} allowFontScaling>
              Screen Reader Active
            </Text>
            <Text style={styles.settingDescription} allowFontScaling>
              {settings.screenReaderEnabled
                ? 'VoiceOver/TalkBack is currently active. This app is optimized for screen readers.'
                : 'No screen reader detected. Enable VoiceOver (iOS) or TalkBack (Android) in system settings.'}
            </Text>
            <View style={styles.systemBadge}>
              <Ionicons
                name="phone-portrait"
                size={12}
                color={theme.colors.onPrimaryContainer}
              />
              <Text style={styles.systemBadgeText} allowFontScaling={false}>
                System Setting
              </Text>
            </View>
          </View>
          <Ionicons
            name={
              settings.screenReaderEnabled
                ? 'checkmark-circle'
                : 'close-circle'
            }
            size={24}
            color={
              settings.screenReaderEnabled
                ? theme.colors.success
                : theme.colors.onSurfaceVariant
            }
          />
        </View>

        {Platform.OS === 'ios' && (
          <>
            <Divider />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle} allowFontScaling>
                  Bold Text
                </Text>
                <Text style={styles.settingDescription} allowFontScaling>
                  {settings.boldTextEnabled
                    ? 'Bold text is enabled in system settings.'
                    : 'Enable bold text in system settings for bolder interface text.'}
                </Text>
                <View style={styles.systemBadge}>
                  <Ionicons
                    name="phone-portrait"
                    size={12}
                    color={theme.colors.onPrimaryContainer}
                  />
                  <Text style={styles.systemBadgeText} allowFontScaling={false}>
                    System Setting
                  </Text>
                </View>
              </View>
              <Ionicons
                name={
                  settings.boldTextEnabled ? 'checkmark-circle' : 'close-circle'
                }
                size={24}
                color={
                  settings.boldTextEnabled
                    ? theme.colors.success
                    : theme.colors.onSurfaceVariant
                }
              />
            </View>
          </>
        )}

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetSettings}
          accessibilityRole="button"
          accessibilityLabel="Reset accessibility settings"
          accessibilityHint="Resets all accessibility settings to default values"
        >
          <Text style={styles.resetButtonText} allowFontScaling>
            Reset to Defaults
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AccessibilitySettingsScreen;
