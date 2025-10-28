import React from 'react';
import { useRegisterScreen } from '../hooks';
import { FormScreenTemplate } from '@shared/components/templates';
import { Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const props = useRegisterScreen(navigation);
  const { theme } = useTheme();

  return (
    <FormScreenTemplate
      title="Create Account"
      subtitle="Join the Sportification community"
      fields={props.formFields}
      onSubmit={props.handleRegister}
      isLoading={props.isLoading}
      submitLabel="Create Account"
      icon="account-plus"
      additionalContent={
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
      }
    />
  );
};

const styles = StyleSheet.create({
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});

export default RegisterScreen;
