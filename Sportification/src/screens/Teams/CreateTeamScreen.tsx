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
import { useCreateTeamMutation } from '../../store/api/teamApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface CreateTeamScreenProps {
  navigation: any;
}

const SPORTS = [
  'Football',
  'Basketball',
  'Tennis',
  'Volleyball',
  'Cricket',
  'Baseball',
  'Badminton',
  'Table Tennis',
  'Other',
];

const CreateTeamScreen: React.FC<CreateTeamScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    description: '',
    maxMembers: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    sport: '',
    maxMembers: '',
  });

  const [createTeam, { isLoading }] = useCreateTeamMutation();

  const validate = (): boolean => {
    let valid = true;
    const newErrors = { name: '', sport: '', maxMembers: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
      valid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = 'Team name must be at least 3 characters';
      valid = false;
    }

    if (!formData.sport.trim()) {
      newErrors.sport = 'Sport is required';
      valid = false;
    }

    if (formData.maxMembers) {
      const max = parseInt(formData.maxMembers, 10);
      if (isNaN(max) || max < 2) {
        newErrors.maxMembers = 'Maximum members must be at least 2';
        valid = false;
      } else if (max > 100) {
        newErrors.maxMembers = 'Maximum members cannot exceed 100';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      const teamData: any = {
        name: formData.name.trim(),
        sport: formData.sport.trim(),
        description: formData.description.trim() || undefined,
      };

      if (formData.maxMembers) {
        teamData.maxMembers = parseInt(formData.maxMembers, 10);
      }

      const result = await createTeam(teamData).unwrap();

      if (result.success && result.data) {
        Alert.alert('Success', 'Team created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('TeamDetail', { teamId: result.data.id }),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to create team. Please try again.'
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
          <Text style={styles.title}>Create Your Team</Text>
          <Text style={styles.subtitle}>
            Start building your sports team community
          </Text>

          <Input
            label="Team Name *"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            placeholder="Enter team name"
            error={errors.name}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sport *</Text>
            <View style={styles.sportGrid}>
              {SPORTS.map((sport) => (
                <Button
                  key={sport}
                  title={sport}
                  onPress={() => updateField('sport', sport)}
                  variant={formData.sport === sport ? 'primary' : 'outline'}
                  style={styles.sportButton}
                  textStyle={styles.sportButtonText}
                />
              ))}
            </View>
            {errors.sport ? (
              <Text style={styles.error}>{errors.sport}</Text>
            ) : null}
          </View>

          <Input
            label="Description (Optional)"
            value={formData.description}
            onChangeText={(text) => updateField('description', text)}
            placeholder="Tell us about your team"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <Input
            label="Maximum Members (Optional)"
            value={formData.maxMembers}
            onChangeText={(text) => updateField('maxMembers', text)}
            placeholder="e.g., 15"
            keyboardType="numeric"
            error={errors.maxMembers}
          />

          <Button
            title="Create Team"
            onPress={handleCreate}
            loading={isLoading}
            style={styles.createButton}
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  sportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  sportButton: {
    margin: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  sportButtonText: {
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    marginBottom: 12,
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CreateTeamScreen;
