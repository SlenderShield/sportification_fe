import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { localizationService } from '../../services/localizationService';
import { biometricService } from '../../services/biometricService';
import { analyticsService } from '../../services/analyticsService';
import { useTheme } from '../../theme';
import Button from '../../components/common/Button';
import { Card, Divider } from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [crashReportingEnabled, setCrashReportingEnabled] = useState(true);

  useEffect(() => {
    checkBiometricsAvailability();
  }, []);

  const checkBiometricsAvailability = async () => {
    const { available, biometryType } = await biometricService.checkAvailability();
    setBiometricsAvailable(available);
    if (available && biometryType) {
      setBiometricType(biometricService.getBiometryTypeName(biometryType));
      const keysExist = await biometricService.keysExist();
      setBiometricsEnabled(keysExist);
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await localizationService.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      Alert.alert(t('common.success'), 'Language changed successfully');
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to change language');
    }
  };

  const handleBiometricToggle = async (enabled: boolean) => {
    if (enabled) {
      const success = await biometricService.authenticate(
        `Enable ${biometricType} for quick login`
      );
      if (success) {
        await biometricService.createKeys();
        setBiometricsEnabled(true);
        Alert.alert(t('common.success'), `${biometricType} enabled successfully`);
      } else {
        Alert.alert(t('common.error'), 'Authentication failed');
      }
    } else {
      await biometricService.deleteKeys();
      setBiometricsEnabled(false);
      Alert.alert(t('common.success'), `${biometricType} disabled`);
    }
  };

  const handleAnalyticsToggle = async (enabled: boolean) => {
    await analyticsService.setAnalyticsEnabled(enabled);
    setAnalyticsEnabled(enabled);
  };

  const handleCrashReportingToggle = async (enabled: boolean) => {
    await analyticsService.setCrashlyticsEnabled(enabled);
    setCrashReportingEnabled(enabled);
  };

  const availableLanguages = localizationService.getAvailableLanguages();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: theme.spacing.base }}>
        {/* Appearance Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card variant="elevated" style={{ marginBottom: theme.spacing.base }}>
            <View style={{ padding: theme.spacing.base }}>
              <View style={styles.sectionHeader}>
                <Icon name="palette" size={24} color={theme.colors.primary} />
                <Text
                  style={[
                    theme.typography.titleLarge,
                    { color: theme.colors.text, marginLeft: theme.spacing.sm },
                  ]}
                >
                  Appearance
                </Text>
              </View>
              <Divider style={{ marginVertical: theme.spacing.md }} />
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[theme.typography.titleMedium, { color: theme.colors.text }]}>
                    Dark Mode
                  </Text>
                  <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
                    {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                  </Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
                  thumbColor={theme.colors.surface}
                  ios_backgroundColor={theme.colors.surfaceVariant}
                />
              </View>
              
              <Divider style={{ marginVertical: theme.spacing.md }} />
              
              <Card
                onPress={() => navigation.navigate('AccessibilitySettings')}
                variant="outlined"
                style={{ marginTop: theme.spacing.xs }}
              >
                <View style={{ padding: theme.spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="human-handsup" size={20} color={theme.colors.primary} />
                      <Text style={[theme.typography.titleMedium, { color: theme.colors.text, marginLeft: theme.spacing.sm }]}>
                        Accessibility Settings
                      </Text>
                    </View>
                    <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
                      Text size, high contrast, motion settings
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
                </View>
              </Card>
            </View>
          </Card>
        </Animated.View>

        {/* Language Section */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Card variant="elevated" style={{ marginBottom: theme.spacing.base }}>
            <View style={{ padding: theme.spacing.base }}>
              <View style={styles.sectionHeader}>
                <Icon name="translate" size={24} color={theme.colors.primary} />
                <Text
                  style={[
                    theme.typography.titleLarge,
                    { color: theme.colors.text, marginLeft: theme.spacing.sm },
                  ]}
                >
                  {t('profile.language')}
                </Text>
              </View>
              <Divider style={{ marginVertical: theme.spacing.md }} />
              
              {availableLanguages.map((lang, index) => (
                <Card
                  key={lang.code}
                  onPress={() => handleLanguageChange(lang.code)}
                  variant={currentLanguage === lang.code ? 'filled' : 'outlined'}
                  style={{ marginBottom: theme.spacing.sm }}
                >
                  <View style={{ padding: theme.spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={[theme.typography.titleMedium, { color: theme.colors.text }]}>
                        {lang.name}
                      </Text>
                      <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
                        {lang.nativeName}
                      </Text>
                    </View>
                    {currentLanguage === lang.code && (
                      <Icon name="check-circle" size={24} color={theme.colors.primary} />
                    )}
                  </View>
                </Card>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Security Section */}
        {biometricsAvailable && (
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Card variant="elevated" style={{ marginBottom: theme.spacing.base }}>
              <View style={{ padding: theme.spacing.base }}>
                <View style={styles.sectionHeader}>
                  <Icon name="shield-lock" size={24} color={theme.colors.primary} />
                  <Text
                    style={[
                      theme.typography.titleLarge,
                      { color: theme.colors.text, marginLeft: theme.spacing.sm },
                    ]}
                  >
                    Security
                  </Text>
                </View>
                <Divider style={{ marginVertical: theme.spacing.md }} />
                
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={[theme.typography.titleMedium, { color: theme.colors.text }]}>
                      {t('auth.enableBiometric')}
                    </Text>
                    <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
                      Use {biometricType} for quick login
                    </Text>
                  </View>
                  <Switch
                    value={biometricsEnabled}
                    onValueChange={handleBiometricToggle}
                    trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
                    thumbColor={theme.colors.surface}
                    ios_backgroundColor={theme.colors.surfaceVariant}
                  />
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Privacy Section */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Card variant="elevated" style={{ marginBottom: theme.spacing.base }}>
            <View style={{ padding: theme.spacing.base }}>
              <View style={styles.sectionHeader}>
                <Icon name="lock" size={24} color={theme.colors.primary} />
                <Text
                  style={[
                    theme.typography.titleLarge,
                    { color: theme.colors.text, marginLeft: theme.spacing.sm },
                  ]}
                >
                  Privacy & Data
                </Text>
              </View>
              <Divider style={{ marginVertical: theme.spacing.md }} />
              
              <View style={[styles.settingRow, { marginBottom: theme.spacing.md }]}>
                <View style={styles.settingInfo}>
                  <Text style={[theme.typography.titleMedium, { color: theme.colors.text }]}>
                    Analytics
                  </Text>
                  <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
                    Help us improve by sharing anonymous usage data
                  </Text>
                </View>
                <Switch
                  value={analyticsEnabled}
                  onValueChange={handleAnalyticsToggle}
                  trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
                  thumbColor={theme.colors.surface}
                  ios_backgroundColor={theme.colors.surfaceVariant}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[theme.typography.titleMedium, { color: theme.colors.text }]}>
                    Crash Reporting
                  </Text>
                  <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
                    Send crash reports to help us fix bugs
                  </Text>
                </View>
                <Switch
                  value={crashReportingEnabled}
                  onValueChange={handleCrashReportingToggle}
                  trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
                  thumbColor={theme.colors.surface}
                  ios_backgroundColor={theme.colors.surfaceVariant}
                />
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Account Section */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Card variant="elevated" style={{ marginBottom: theme.spacing.base }}>
            <View style={{ padding: theme.spacing.base }}>
              <View style={styles.sectionHeader}>
                <Icon name="account-cog" size={24} color={theme.colors.primary} />
                <Text
                  style={[
                    theme.typography.titleLarge,
                    { color: theme.colors.text, marginLeft: theme.spacing.sm },
                  ]}
                >
                  Account
                </Text>
              </View>
              <Divider style={{ marginVertical: theme.spacing.md }} />
              
              <Button
                title="Change Password"
                icon="lock-reset"
                onPress={() => navigation.navigate('ChangePassword')}
                variant="outline"
                fullWidth
                style={{ marginBottom: theme.spacing.sm }}
              />

              <Button
                title={t('auth.logout')}
                icon="logout"
                onPress={() => {
                  Alert.alert(
                    'Logout',
                    'Are you sure you want to logout?',
                    [
                      { text: t('common.cancel'), style: 'cancel' },
                      {
                        text: 'Logout',
                        style: 'destructive',
                        onPress: () => {
                          navigation.reset({
                            index: 0,
                            routes: [{ name: 'Auth' }],
                          });
                        },
                      },
                    ]
                  );
                }}
                variant="outline"
                fullWidth
              />
            </View>
          </Card>
        </Animated.View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Icon
            name="information-outline"
            size={16}
            color={theme.colors.textTertiary}
            style={{ marginBottom: theme.spacing.xs }}
          />
          <Text style={[theme.typography.labelSmall, { color: theme.colors.textTertiary }]}>
            Version 2.0.0
          </Text>
          <Text style={[theme.typography.labelSmall, { color: theme.colors.textTertiary }]}>
            © 2025 Sportification
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  versionContainer: {
    padding: 24,
    alignItems: 'center',
  },
});

export default SettingsScreen;
