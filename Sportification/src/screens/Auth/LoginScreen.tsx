import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLoginMutation, useLoginWithGoogleMutation, useLoginWithAppleMutation, useLoginWithFacebookMutation } from '../../store/api/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Sportification</Text>
          <Text style={styles.subtitle}>{t('auth.login')}</Text>

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
            secureTextEntry
            error={errors.password}
          />

          <Button
            title={t('auth.login')}
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          {biometricAvailable && (
            <Button
              title={t('auth.biometricLogin', { type: biometricType })}
              onPress={handleBiometricLogin}
              variant="outline"
              style={styles.biometricButton}
            />
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title={t('auth.loginWithGoogle')}
            onPress={handleGoogleLogin}
            loading={isGoogleLoading}
            variant="outline"
            style={styles.socialButton}
          />

          {Platform.OS === 'ios' && appleAuthService.isSupported() && (
            <Button
              title={t('auth.loginWithApple')}
              onPress={handleAppleLogin}
              loading={isAppleLoading}
              variant="outline"
              style={styles.socialButton}
            />
          )}

          <Button
            title={t('auth.loginWithFacebook')}
            onPress={handleFacebookLogin}
            loading={isFacebookLoading}
            variant="outline"
            style={styles.socialButton}
          />

          <Button
            title={t('auth.register')}
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            style={styles.registerButton}
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
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  loginButton: {
    marginBottom: 12,
  },
  biometricButton: {
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  socialButton: {
    marginBottom: 8,
  },
  registerButton: {
    marginTop: 8,
  },
});

export default LoginScreen;
