import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRegisterMutation } from '../../store/api/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice';
import { useTheme } from '../../theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();

  const validate = (): boolean => {
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      }).unwrap();

      if (result.success && result.data) {
        dispatch(setUser(result.data.user));
      }
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error?.data?.message || 'Unable to create account'
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
        <View style={[styles.content, { paddingHorizontal: theme.spacing.xl }]}>
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={[styles.header, { marginBottom: theme.spacing['2xl'] }]}
          >
            <View
              style={[
                styles.logoContainer,
                {
                  backgroundColor: theme.colors.secondary,
                  marginBottom: theme.spacing.xl,
                },
              ]}
            >
              <Icon name="account-plus" size={48} color={theme.colors.onSecondary} />
            </View>
            <Text
              style={[
                theme.typography.displaySmall,
                { color: theme.colors.text, marginBottom: theme.spacing.xs },
              ]}
            >
              Create Account
            </Text>
            <Text
              style={[
                theme.typography.bodyLarge,
                { color: theme.colors.textSecondary },
              ]}
            >
              Join the Sportification community
            </Text>
          </Animated.View>

          {/* Registration Form */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
              variant="outlined"
              error={errors.email}
            />

            <Input
              label="Username"
              value={formData.username}
              onChangeText={(text) => updateField('username', text)}
              placeholder="Choose a username"
              autoCapitalize="none"
              leftIcon="account"
              variant="outlined"
              error={errors.username}
              helperText="At least 3 characters"
            />

            <Input
              label="Password"
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              variant="outlined"
              error={errors.password}
              helperText="At least 6 characters"
            />

            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              leftIcon="lock-check"
              rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              variant="outlined"
              error={errors.confirmPassword}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              icon="account-plus"
              fullWidth
              style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.md }}
            />
          </Animated.View>

          {/* Sign In Link */}
          <Animated.View
            entering={FadeInUp.delay(300).springify()}
            style={styles.signinContainer}
          >
            <Text
              style={[
                theme.typography.bodyMedium,
                { color: theme.colors.textSecondary },
              ]}
            >
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => navigation.goBack()}>
              <Text
                style={[
                  theme.typography.bodyMedium,
                  { color: theme.colors.primary, fontWeight: '600' },
                ]}
              >
                Sign In
              </Text>
            </Pressable>
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
    paddingVertical: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});

export default RegisterScreen;
