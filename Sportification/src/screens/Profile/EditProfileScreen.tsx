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
import { useUpdateProfileMutation } from '../../store/api/userApi';
import { useAppSelector } from '../../store/hooks';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface EditProfileScreenProps {
  navigation: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>Update your profile information</Text>

          <Input
            label="Username"
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
            placeholder="Enter your username"
          />

          <Input
            label="Bio (Optional)"
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <Button
            title="Update Profile"
            onPress={handleUpdate}
            loading={isLoading}
            style={styles.updateButton}
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    marginBottom: 12,
  },
});

export default EditProfileScreen;
