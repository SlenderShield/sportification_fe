import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useChangePasswordMutation } from '../../store/api/authApi';
import { useTheme } from '../../theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Card } from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ChangePasswordScreenProps {
  navigation: any;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const validate = (): boolean => {
    let valid = true;
    const newErrors = { currentPassword: '', newPassword: '', confirmPassword: '' };

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      valid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
      valid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;

    try {
      const result = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      if (result.success) {
        Alert.alert('Success', 'Password changed successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to change password. Please try again.'
      );
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, { padding: theme.spacing.base }]}>
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={{ marginBottom: theme.spacing.xl }}
          >
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: theme.colors.warning + '20',
                    padding: theme.spacing.lg,
                    borderRadius: 60,
                  },
                ]}
              >
                <Icon name="lock-reset" size={48} color={theme.colors.warning} />
              </View>
            </View>
            <Text
              style={[
                theme.typography.displaySmall,
                { color: theme.colors.text, textAlign: 'center', marginTop: theme.spacing.md },
              ]}
            >
              Change Password
            </Text>
            <Text
              style={[
                theme.typography.bodyMedium,
                { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.xs },
              ]}
            >
              Update your account password
            </Text>
          </Animated.View>

          {/* Password Form */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant="elevated" style={{ marginBottom: theme.spacing.base }}>
              <View style={{ padding: theme.spacing.base }}>
                <Input
                  label="Current Password"
                  value={formData.currentPassword}
                  onChangeText={(text) => updateField('currentPassword', text)}
                  placeholder="Enter current password"
                  secureTextEntry={!showCurrentPassword}
                  leftIcon="lock"
                  rightIcon={showCurrentPassword ? 'eye-off' : 'eye'}
                  onRightIconPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  variant="outlined"
                  error={errors.currentPassword}
                />

                <Input
                  label="New Password"
                  value={formData.newPassword}
                  onChangeText={(text) => updateField('newPassword', text)}
                  placeholder="Enter new password"
                  secureTextEntry={!showNewPassword}
                  leftIcon="lock-plus"
                  rightIcon={showNewPassword ? 'eye-off' : 'eye'}
                  onRightIconPress={() => setShowNewPassword(!showNewPassword)}
                  variant="outlined"
                  error={errors.newPassword}
                  helperText="At least 6 characters"
                />

                <Input
                  label="Confirm New Password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateField('confirmPassword', text)}
                  placeholder="Confirm new password"
                  secureTextEntry={!showConfirmPassword}
                  leftIcon="lock-check"
                  rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  variant="outlined"
                  error={errors.confirmPassword}
                />
              </View>
            </Card>
          </Animated.View>

          {/* Info Card */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Card
              variant="outlined"
              style={{ marginBottom: theme.spacing.xl, backgroundColor: theme.colors.info + '10' }}
            >
              <View style={{ padding: theme.spacing.md, flexDirection: 'row' }}>
                <Icon
                  name="information"
                  size={20}
                  color={theme.colors.info}
                  style={{ marginRight: theme.spacing.sm }}
                />
                <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary, flex: 1 }]}>
                  Choose a strong password that you haven't used before. A good password has a mix of letters, numbers, and symbols.
                </Text>
              </View>
            </Card>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Button
              title="Update Password"
              icon="content-save"
              onPress={handleChangePassword}
              loading={isLoading}
              fullWidth
              style={{ marginBottom: theme.spacing.sm }}
            />

            <Button
              title="Cancel"
              icon="close"
              onPress={() => navigation.goBack()}
              variant="outline"
              fullWidth
            />
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChangePasswordScreen;
