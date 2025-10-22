import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { localizationService } from '../../services/localizationService';
import { biometricService } from '../../services/biometricService';
import { analyticsService } from '../../services/analyticsService';
import Button from '../../components/common/Button';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
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
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.language')}</Text>
        {availableLanguages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageOption,
              currentLanguage === lang.code && styles.languageOptionSelected,
            ]}
            onPress={() => handleLanguageChange(lang.code)}
          >
            <View>
              <Text style={styles.languageName}>{lang.name}</Text>
              <Text style={styles.languageNative}>{lang.nativeName}</Text>
            </View>
            {currentLanguage === lang.code && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {biometricsAvailable && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {t('auth.enableBiometric')}
              </Text>
              <Text style={styles.settingDescription}>
                Use {biometricType} for quick login
              </Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: '#767577', true: '#1E3A8A' }}
              thumbColor={biometricsEnabled ? '#10B981' : '#f4f3f4'}
            />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Data</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Analytics</Text>
            <Text style={styles.settingDescription}>
              Help us improve by sharing anonymous usage data
            </Text>
          </View>
          <Switch
            value={analyticsEnabled}
            onValueChange={handleAnalyticsToggle}
            trackColor={{ false: '#767577', true: '#1E3A8A' }}
            thumbColor={analyticsEnabled ? '#10B981' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Crash Reporting</Text>
            <Text style={styles.settingDescription}>
              Send crash reports to help us fix bugs
            </Text>
          </View>
          <Switch
            value={crashReportingEnabled}
            onValueChange={handleCrashReportingToggle}
            trackColor={{ false: '#767577', true: '#1E3A8A' }}
            thumbColor={crashReportingEnabled ? '#10B981' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <Button
          title="Change Password"
          onPress={() => navigation.navigate('ChangePassword')}
          variant="outline"
          style={styles.button}
        />

        <Button
          title={t('auth.logout')}
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
                    // Handle logout
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
          style={styles.logoutButton}
        />
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 2.0.0</Text>
        <Text style={styles.versionText}>© 2025 Sportification</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageOptionSelected: {
    backgroundColor: '#f8f9fa',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  languageNative: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 20,
    color: '#1E3A8A',
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  button: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderColor: '#dc2626',
  },
  versionContainer: {
    padding: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    marginVertical: 2,
  },
});

export default SettingsScreen;
