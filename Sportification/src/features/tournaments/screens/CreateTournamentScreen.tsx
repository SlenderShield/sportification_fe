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
import { useCreateTournamentMutation } from '../../store/api/tournamentApi';
import { useTheme } from '../../theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Card, Chip, SportSelector, SectionHeader } from '../../components/ui';
import { Icon } from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SPORTS, TOURNAMENT_FORMATS } from '@core/constants';
import { validateName, validateDate, validateNumber, validateSelection } from '../../utils/validation';

interface CreateTournamentScreenProps {
  navigation: any;
}

const CreateTournamentScreen: React.FC<CreateTournamentScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    format: '',
    description: '',
    startDate: '',
    maxParticipants: '',
    prizePool: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    sport: '',
    format: '',
    startDate: '',
    maxParticipants: '',
  });

  const [createTournament, { isLoading }] = useCreateTournamentMutation();

  const validate = (): boolean => {
    const newErrors = { name: '', sport: '', format: '', startDate: '', maxParticipants: '' };

    // Use validation utilities
    const nameValidation = validateName(formData.name, 'Tournament name', 3);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error || '';
    }

    const sportValidation = validateSelection(formData.sport, 'Sport');
    if (!sportValidation.isValid) {
      newErrors.sport = sportValidation.error || '';
    }

    const formatValidation = validateSelection(formData.format, 'Format');
    if (!formatValidation.isValid) {
      newErrors.format = formatValidation.error || '';
    }

    const dateValidation = validateDate(formData.startDate, 'Start date');
    if (!dateValidation.isValid) {
      newErrors.startDate = dateValidation.error || '';
    }

    const maxParticipantsValidation = validateNumber(
      formData.maxParticipants,
      'Maximum participants',
      4,
      256
    );
    if (!maxParticipantsValidation.isValid) {
      newErrors.maxParticipants = maxParticipantsValidation.error || '';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      const tournamentData: any = {
        name: formData.name.trim(),
        sport: formData.sport.trim(),
        format: formData.format.trim(),
        schedule: {
          startDate: formData.startDate.trim(),
        },
        maxParticipants: parseInt(formData.maxParticipants, 10),
        description: formData.description.trim() || undefined,
        prizePool: formData.prizePool.trim() || undefined,
      };

      const result = await createTournament(tournamentData).unwrap();

      if (result.success && result.data) {
        Alert.alert('Success', 'Tournament created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('TournamentDetail', { tournamentId: result.data!.id }),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to create tournament. Please try again.'
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
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.tertiary + '20' }]}>
              <Icon name="trophy-variant-plus" size={48} color={theme.colors.tertiary} />
            </View>
            <Text style={[styles.title, theme.typography.displaySmall, { color: theme.colors.text }]}>
              Create Tournament
            </Text>
            <Text style={[styles.subtitle, theme.typography.bodyMedium, { color: theme.colors.textSecondary }]}>
              Organize a competitive tournament
            </Text>
          </Animated.View>

          {/* Tournament Details Card */}
          <Animated.View entering={FadeInDown.duration(300).delay(200)}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="trophy" size={20} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, theme.typography.titleMedium, { color: theme.colors.text }]}>
                  Tournament Details
                </Text>
              </View>

              <Input
                label="Tournament Name *"
                value={formData.name}
                onChangeText={(text) => updateField('name', text)}
                placeholder="e.g., Summer Basketball Championship"
                error={errors.name}
                leftIcon="trophy"
              />

              <Input
                label="Description (Optional)"
                value={formData.description}
                onChangeText={(text) => updateField('description', text)}
                placeholder="Tell participants about this tournament"
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

              <View style={styles.chipsGrid}>
                {SPORTS.map((sport) => (
                  <Chip
                    key={sport.name}
                    label={sport.name}
                    icon={sport.icon}
                    selected={formData.sport === sport.name}
                    onPress={() => updateField('sport', sport.name)}
                    style={styles.chip}
                  />
                ))}
              </View>
              {errors.sport ? (
                <Text style={[styles.error, { color: theme.colors.error }]}>{errors.sport}</Text>
              ) : null}
            </Card>
          </Animated.View>

          {/* Format Selection Card */}
          <Animated.View entering={FadeInDown.duration(300).delay(400)}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="tournament" size={20} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, theme.typography.titleMedium, { color: theme.colors.text }]}>
                  Format *
                </Text>
              </View>

              <View style={styles.chipsGrid}>
                {FORMATS.map((format) => (
                  <Chip
                    key={format.name}
                    label={format.label}
                    icon={format.icon}
                    selected={formData.format === format.name}
                    onPress={() => updateField('format', format.name)}
                    style={styles.chip}
                  />
                ))}
              </View>
              {errors.format ? (
                <Text style={[styles.error, { color: theme.colors.error }]}>{errors.format}</Text>
              ) : null}
            </Card>
          </Animated.View>

          {/* Schedule & Participants Card */}
          <Animated.View entering={FadeInDown.duration(300).delay(500)}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="calendar-clock" size={20} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, theme.typography.titleMedium, { color: theme.colors.text }]}>
                  Schedule & Participants
                </Text>
              </View>

              <Input
                label="Start Date *"
                value={formData.startDate}
                onChangeText={(text) => updateField('startDate', text)}
                placeholder="YYYY-MM-DD"
                error={errors.startDate}
                helperText="Format: YYYY-MM-DD (e.g., 2025-01-15)"
                leftIcon="calendar"
              />

              <Input
                label="Maximum Participants *"
                value={formData.maxParticipants}
                onChangeText={(text) => updateField('maxParticipants', text)}
                placeholder="e.g., 16"
                keyboardType="numeric"
                error={errors.maxParticipants}
                helperText="Minimum 4, maximum 256 participants"
                leftIcon="account-multiple"
              />
            </Card>
          </Animated.View>

          {/* Optional Fields Card */}
          <Animated.View entering={FadeInDown.duration(300).delay(600)}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="cash" size={20} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, theme.typography.titleMedium, { color: theme.colors.text }]}>
                  Optional Information
                </Text>
              </View>

              <Input
                label="Prize Pool (Optional)"
                value={formData.prizePool}
                onChangeText={(text) => updateField('prizePool', text)}
                placeholder="e.g., $500 cash prize"
                helperText="Describe the prizes or rewards"
                leftIcon="cash"
              />
            </Card>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInDown.duration(300).delay(700)} style={styles.actions}>
            <Button
              title="Create Tournament"
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
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
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

export default CreateTournamentScreen;
