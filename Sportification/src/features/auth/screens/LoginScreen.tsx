import React, { useState, useEffect } from 'react';
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
import { useLoginMutation, useLoginWithGoogleMutation, useLoginWithAppleMutation, useLoginWithFacebookMutation } from '../../store/api/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { googleAuthService } from '../../services/googleAuthService';
import { appleAuthService } from '../../services/appleAuthService';
import { facebookAuthService } from '../../services/facebookAuthService';
import { biometricService } from '../../services/biometricService';
import { analyticsService } from '../../services/analyticsService';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  const [login, { isLoading }] = useLoginMutation();
  const [loginWithGoogle, { isLoading: isGoogleLoading }] = useLoginWithGoogleMutation();
  const [loginWithApple, { isLoading: isAppleLoading }] = useLoginWithAppleMutation();
  const [loginWithFacebook, { isLoading: isFacebookLoading }] = useLoginWithFacebookMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const { available, biometryType } = await biometricService.checkAvailability();
    setBiometricAvailable(available);
    if (biometryType) {
      setBiometricType(biometricService.getBiometryTypeName(biometryType));
    }
  };

  const validate = (): boolean => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = t('errors.required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('errors.invalidEmail');
      valid = false;
    }

    if (!password) {
      newErrors.password = t('errors.required');
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = t('errors.weakPassword');
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const result = await login({ email, password }).unwrap();
      if (result.success && result.data) {
        dispatch(setUser(result.data.user));
        await analyticsService.logLogin('email');
      }
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error?.data?.message || t('errors.networkError')
      );
    }
  };

  const handleBiometricLogin = async () => {
    const success = await biometricService.authenticate(t('auth.biometricLogin', { type: biometricType }));
    if (success) {
      // In a real app, you would retrieve stored credentials here
      // For now, just show a success message
      Alert.alert(t('common.success'), 'Biometric authentication successful');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const googleUser = await googleAuthService.signIn();
      if (googleUser) {
        const result = await loginWithGoogle({ idToken: googleUser.idToken }).unwrap();
        if (result.success && result.data) {
          dispatch(setUser(result.data.user));
          await analyticsService.logLogin('google');
        }
      }
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error?.data?.message || 'Google login failed'
      );
    }
  };

  const handleAppleLogin = async () => {
    try {
      const appleUser = await appleAuthService.signIn();
      if (appleUser) {
        const result = await loginWithApple({
          identityToken: appleUser.identityToken,
          authorizationCode: appleUser.authorizationCode,
          user: appleUser.user,
        }).unwrap();
        if (result.success && result.data) {
          dispatch(setUser(result.data.user));
          await analyticsService.logLogin('apple');
        }
      }
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error?.data?.message || 'Apple login failed'
      );
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const facebookUser = await facebookAuthService.signIn();
      if (facebookUser) {
        const result = await loginWithFacebook({ accessToken: facebookUser.accessToken }).unwrap();
        if (result.success && result.data) {
          dispatch(setUser(result.data.user));
          await analyticsService.logLogin('facebook');
        }
      }
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error?.data?.message || 'Facebook login failed'
      );
    }
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
                  backgroundColor: theme.colors.primary,
                  marginBottom: theme.spacing.xl,
                },
              ]}
            >
              <Icon name="soccer" size={48} color={theme.colors.onPrimary} />
            </View>
            <Text
              style={[
                theme.typography.displaySmall,
                { color: theme.colors.text, marginBottom: theme.spacing.xs },
              ]}
            >
              Welcome Back
            </Text>
            <Text
              style={[
                theme.typography.bodyLarge,
                { color: theme.colors.textSecondary },
              ]}
            >
              Sign in to continue your sports journey
            </Text>
          </Animated.View>

          {/* Login Form */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Input
              label={t('auth.email')}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: '' });
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
              variant="outlined"
              error={errors.email}
            />

            <Input
              label={t('auth.password')}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: '' });
              }}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              variant="outlined"
              error={errors.password}
            />

            <Pressable
              onPress={() => {}}
              style={{ alignSelf: 'flex-end', marginBottom: theme.spacing.base }}
            >
              <Text
                style={[
                  theme.typography.labelMedium,
                  { color: theme.colors.primary },
                ]}
              >
                Forgot Password?
              </Text>
            </Pressable>

            <Button
              title={t('auth.login')}
              onPress={handleLogin}
              loading={isLoading}
              icon="login"
              fullWidth
              style={{ marginBottom: theme.spacing.md }}
            />

            {biometricAvailable && (
              <Button
                title={t('auth.biometricLogin', { type: biometricType })}
                onPress={handleBiometricLogin}
                variant="outline"
                icon="fingerprint"
                fullWidth
                style={{ marginBottom: theme.spacing.base }}
              />
            )}
          </Animated.View>

          {/* Divider */}
          <Animated.View
            entering={FadeInDown.delay(300).springify()}
            style={[styles.divider, { marginVertical: theme.spacing.xl }]}
          >
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: theme.colors.outline },
              ]}
            />
            <Text
              style={[
                theme.typography.labelMedium,
                {
                  color: theme.colors.textSecondary,
                  marginHorizontal: theme.spacing.base,
                },
              ]}
            >
              OR CONTINUE WITH
            </Text>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: theme.colors.outline },
              ]}
            />
          </Animated.View>

          {/* Social Login */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Button
              title={t('auth.loginWithGoogle')}
              onPress={handleGoogleLogin}
              loading={isGoogleLoading}
              variant="outline"
              icon="google"
              fullWidth
              style={{ marginBottom: theme.spacing.sm }}
            />

            {Platform.OS === 'ios' && appleAuthService.isSupported() && (
              <Button
                title={t('auth.loginWithApple')}
                onPress={handleAppleLogin}
                loading={isAppleLoading}
                variant="outline"
                icon="apple"
                fullWidth
                style={{ marginBottom: theme.spacing.sm }}
              />
            )}

            <Button
              title={t('auth.loginWithFacebook')}
              onPress={handleFacebookLogin}
              loading={isFacebookLoading}
              variant="outline"
              icon="facebook"
              fullWidth
              style={{ marginBottom: theme.spacing.xl }}
            />
          </Animated.View>

          {/* Register Link */}
          <Animated.View
            entering={FadeInUp.delay(500).springify()}
            style={styles.registerContainer}
          >
            <Text
              style={[
                theme.typography.bodyMedium,
                { color: theme.colors.textSecondary },
              ]}
            >
              Don't have an account?{' '}
            </Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text
                style={[
                  theme.typography.bodyMedium,
                  { color: theme.colors.primary, fontWeight: '600' },
                ]}
              >
                Sign Up
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
