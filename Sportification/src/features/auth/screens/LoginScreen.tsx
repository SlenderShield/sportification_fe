import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLoginScreen } from '../hooks';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme';
import { Button, Input } from '@shared/components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const props = useLoginScreen(navigation);

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
              value={props.email}
              onChangeText={props.onEmailChange}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
              variant="outlined"
              error={props.errors.email}
            />

            <Input
              label={t('auth.password')}
              value={props.password}
              onChangeText={props.onPasswordChange}
              placeholder="Enter your password"
              secureTextEntry={!props.showPassword}
              leftIcon="lock"
              rightIcon={props.showPassword ? 'eye-off' : 'eye'}
              onRightIconPress={props.toggleShowPassword}
              variant="outlined"
              error={props.errors.password}
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
              onPress={props.handleLogin}
              loading={props.isLoading}
              icon="login"
              fullWidth
              style={{ marginBottom: theme.spacing.md }}
            />

            {props.biometricAvailable && (
              <Button
                title={t('auth.biometricLogin', { type: props.biometricType })}
                onPress={props.handleBiometricLogin}
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
              onPress={props.handleGoogleLogin}
              loading={props.isGoogleLoading}
              variant="outline"
              icon="google"
              fullWidth
              style={{ marginBottom: theme.spacing.sm }}
            />

            {props.showAppleLogin && (
              <Button
                title={t('auth.loginWithApple')}
                onPress={props.handleAppleLogin}
                loading={props.isAppleLoading}
                variant="outline"
                icon="apple"
                fullWidth
                style={{ marginBottom: theme.spacing.sm }}
              />
            )}

            <Button
              title={t('auth.loginWithFacebook')}
              onPress={props.handleFacebookLogin}
              loading={props.isFacebookLoading}
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
