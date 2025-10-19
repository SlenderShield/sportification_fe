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
import { useChangePasswordMutation } from '../../store/api/authApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface ChangePasswordScreenProps {
  navigation: any;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>Update your account password</Text>

          <Input
            label="Current Password"
            value={formData.currentPassword}
            onChangeText={(text) => updateField('currentPassword', text)}
            placeholder="Enter current password"
            secureTextEntry
            error={errors.currentPassword}
          />

          <Input
            label="New Password"
            value={formData.newPassword}
            onChangeText={(text) => updateField('newPassword', text)}
            placeholder="Enter new password"
            secureTextEntry
            error={errors.newPassword}
          />

          <Input
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
            placeholder="Confirm new password"
            secureTextEntry
            error={errors.confirmPassword}
          />

          <Button
            title="Change Password"
            onPress={handleChangePassword}
            loading={isLoading}
            style={styles.changeButton}
          />

          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  changeButton: {
    marginBottom: 12,
  },
});

export default ChangePasswordScreen;
