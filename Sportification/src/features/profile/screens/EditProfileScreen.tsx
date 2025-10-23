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
import { useUpdateProfileMutation } from '../../store/api/userApi';
import { useAppSelector } from '../../store/hooks';
import { useTheme } from '../../theme';
import { Button } from '@shared/components/atoms';
import { Input } from '@shared/components/atoms';
import { Card, Avatar, Divider } from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface EditProfileScreenProps {
  navigation: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.profile?.bio || '',
  });

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleUpdate = async () => {
    if (!formData.username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    try {
      const updateData: any = {
        username: formData.username.trim(),
      };

      if (formData.bio.trim()) {
        updateData.bio = formData.bio.trim();
      }

      const result = await updateProfile(updateData).unwrap();

      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to update profile. Please try again.'
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
        <View style={[styles.content, { padding: theme.spacing.base }]}>
          {/* Profile Picture Section */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Card variant="elevated" style={{ marginBottom: theme.spacing.base }}>
              <View style={{ padding: theme.spacing.xl, alignItems: 'center' }}>
                <Avatar
                  name={user?.username}
                  size="xlarge"
                  variant="circular"
                  style={{ marginBottom: theme.spacing.md }}
                />
                <Text
                  style={[
                    theme.typography.titleLarge,
                    { color: theme.colors.text, textAlign: 'center' },
                  ]}
                >
                  {user?.username}
                </Text>
                <Text
                  style={[
                    theme.typography.bodySmall,
                    { color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
                  ]}
                >
                  {user?.email}
                </Text>
                <Button
                  title="Change Photo"
                  onPress={() => {
                    Alert.alert('Coming Soon', 'Photo upload feature will be available soon');
                  }}
                  variant="text"
                  size="small"
                  icon="camera"
                  style={{ marginTop: theme.spacing.md }}
                />
              </View>
            </Card>
          </Animated.View>

          {/* Profile Information Section */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant="elevated" style={{ marginBottom: theme.spacing.base }}>
              <View style={{ padding: theme.spacing.base }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
                  <Icon
                    name="account-edit"
                    size={24}
                    color={theme.colors.primary}
                    style={{ marginRight: theme.spacing.sm }}
                  />
                  <Text
                    style={[
                      theme.typography.titleMedium,
                      { color: theme.colors.text },
                    ]}
                  >
                    Profile Information
                  </Text>
                </View>

                <Divider style={{ marginBottom: theme.spacing.base }} />

                <Input
                  label="Username"
                  value={formData.username}
                  onChangeText={(text) => setFormData({ ...formData, username: text })}
                  placeholder="Enter your username"
                  leftIcon="account"
                  variant="outlined"
                  helperText="This is how others will see you"
                />

                <Input
                  label="Bio (Optional)"
                  value={formData.bio}
                  onChangeText={(text) => setFormData({ ...formData, bio: text })}
                  placeholder="Tell us about yourself"
                  leftIcon="text"
                  variant="outlined"
                  multiline
                  numberOfLines={4}
                  style={styles.textArea}
                  helperText={`${formData.bio.length}/200 characters`}
                />
              </View>
            </Card>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Button
              title="Save Changes"
              onPress={handleUpdate}
              loading={isLoading}
              icon="content-save"
              fullWidth
              style={{ marginBottom: theme.spacing.sm }}
            />

            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              icon="close"
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
    paddingVertical: 16,
  },
  content: {
    flex: 1,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default EditProfileScreen;
