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
import { useTheme } from '../../theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Card, SportSelector, SectionHeader } from '../../components/ui';
import { Icon } from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SPORTS } from '@core/constants';
import { validateName, validateNumber, validateSelection } from '../../utils/validation';

interface CreateTeamScreenProps {
  navigation: any;
}

const CreateTeamScreen: React.FC<CreateTeamScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
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
    const newErrors = { name: '', sport: '', maxMembers: '' };

    // Use validation utilities
    const nameValidation = validateName(formData.name, 'Team name', 3);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error || '';
    }

    const sportValidation = validateSelection(formData.sport, 'Sport');
    if (!sportValidation.isValid) {
      newErrors.sport = sportValidation.error || '';
    }

    if (formData.maxMembers) {
      const maxMembersValidation = validateNumber(
        formData.maxMembers,
        'Maximum members',
        2,
        100
      );
      if (!maxMembersValidation.isValid) {
        newErrors.maxMembers = maxMembersValidation.error || '';
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
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
            onPress: () => navigation.navigate('TeamDetail', { teamId: result.data!.id }),
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
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(300).delay(100)} style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Icon name="account-group-plus" size={48} color={theme.colors.primary} />
            </View>
            <Text style={[styles.title, theme.typography.displaySmall, { color: theme.colors.text }]}>
              Create Your Team
            </Text>
            <Text style={[styles.subtitle, theme.typography.bodyMedium, { color: theme.colors.textSecondary }]}>
              Start building your sports team community
            </Text>
          </Animated.View>

          {/* Team Details Card */}
          <Animated.View entering={FadeInDown.duration(300).delay(200)}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="information" size={20} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, theme.typography.titleMedium, { color: theme.colors.text }]}>
                  Team Details
                </Text>
              </View>

              <Input
                label="Team Name *"
                value={formData.name}
                onChangeText={(text) => updateField('name', text)}
                placeholder="Enter team name"
                error={errors.name}
                leftIcon="shield-account"
              />

              <Input
                label="Description (Optional)"
                value={formData.description}
                onChangeText={(text) => updateField('description', text)}
                placeholder="Tell us about your team"
                multiline
                numberOfLines={4}
                leftIcon="text"
              />
            </Card>
          </Animated.View>

          {/* Sport Selection Card */}
          <Animated.View entering={FadeInDown.duration(300).delay(300)}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="soccer" size={20} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, theme.typography.titleMedium, { color: theme.colors.text }]}>
                  Sport *
                </Text>
              </View>

              <View style={styles.sportsGrid}>
                {SPORTS.map((sport) => (
                  <Chip
                    key={sport.name}
                    label={sport.name}
                    icon={sport.icon}
                    selected={formData.sport === sport.name}
                    onPress={() => updateField('sport', sport.name)}
                    style={styles.sportChip}
                  />
                ))}
              </View>
              {errors.sport ? (
                <Text style={[styles.error, { color: theme.colors.error }]}>{errors.sport}</Text>
              ) : null}
            </Card>
          </Animated.View>

          {/* Participants Card */}
          <Animated.View entering={FadeInDown.duration(300).delay(400)}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="account-multiple" size={20} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, theme.typography.titleMedium, { color: theme.colors.text }]}>
                  Team Size
                </Text>
              </View>

              <Input
                label="Maximum Members (Optional)"
                value={formData.maxMembers}
                onChangeText={(text) => updateField('maxMembers', text)}
                placeholder="e.g., 15"
                keyboardType="numeric"
                error={errors.maxMembers}
                helperText="Leave empty for unlimited members"
                leftIcon="account-multiple"
              />
            </Card>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInDown.duration(300).delay(500)} style={styles.actions}>
            <Button
              title="Create Team"
              icon="check"
              onPress={handleCreate}
              loading={isLoading}
            />

            <Button
              title="Cancel"
              icon="close"
              onPress={() => navigation.goBack()}
              variant="outline"
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
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    flex: 1,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportChip: {
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  error: {
    marginTop: 8,
    fontSize: 12,
  },
});

export default CreateTeamScreen;
