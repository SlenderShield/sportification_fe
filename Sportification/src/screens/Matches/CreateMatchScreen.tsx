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
import { useCreateMatchMutation } from '../../store/api/matchApi';
import { useGetVenuesQuery } from '../../store/api/venueApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Card, Chip, SportSelector, SectionHeader } from '../../components/ui';
import { useTheme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FadeInDown } from 'react-native-reanimated';
import { SPORTS } from '../../constants/sports';
import { validateName, validateDate, validateTime, validateNumber, validateSelection } from '../../utils/validation';

interface CreateMatchScreenProps {
  navigation: any;
}

const CreateMatchScreen: React.FC<CreateMatchScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    sport: '',
    description: '',
    date: '',
    time: '',
    venueId: '',
    maxParticipants: '',
  });
  const [errors, setErrors] = useState({
    title: '',
    sport: '',
    date: '',
    time: '',
    maxParticipants: '',
  });

  const [createMatch, { isLoading }] = useCreateMatchMutation();
  const { data: venuesData } = useGetVenuesQuery({ page: 1, limit: 50 });
  const venues = venuesData?.data?.items || [];

  const styles = createStyles(theme);

  const validate = (): boolean => {
    const newErrors = { title: '', sport: '', date: '', time: '', maxParticipants: '' };

    // Use validation utilities
    const titleValidation = validateName(formData.title, 'Match title', 3);
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.error || '';
    }

    const sportValidation = validateSelection(formData.sport, 'Sport');
    if (!sportValidation.isValid) {
      newErrors.sport = sportValidation.error || '';
    }

    const dateValidation = validateDate(formData.date, 'Date');
    if (!dateValidation.isValid) {
      newErrors.date = dateValidation.error || '';
    }

    const timeValidation = validateTime(formData.time, 'Time');
    if (!timeValidation.isValid) {
      newErrors.time = timeValidation.error || '';
    }

    const maxParticipantsValidation = validateNumber(
      formData.maxParticipants,
      'Maximum participants',
      2,
      100
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
      const startTime = `${formData.date}T${formData.time}:00.000Z`;
      const startDate = new Date(startTime);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
      
      const matchData: any = {
        title: formData.title.trim(),
        sport: formData.sport.trim(),
        schedule: {
          startTime: startTime,
          endTime: endDate.toISOString(),
        },
        maxParticipants: parseInt(formData.maxParticipants, 10),
        description: formData.description.trim() || undefined,
        venueId: formData.venueId || undefined,
      };

      const result = await createMatch(matchData).unwrap();

      if (result.success && result.data) {
        Alert.alert('Success', 'Match created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MatchDetail', { matchId: result.data!.id }),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to create match. Please try again.'
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
        <FadeInDown delay={100} duration={400}>
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="plus-circle"
                size={48}
                color={theme.colors.primary}
              />
            </View>
            <Text style={[theme.typography.displaySmall, styles.title]}>
              Create New Match
            </Text>
            <Text style={[theme.typography.bodyLarge, styles.subtitle]}>
              Organize a sports match and invite players
            </Text>
          </View>
        </FadeInDown>

        <FadeInDown delay={200} duration={400}>
          <Card style={styles.card}>
            <Text style={[theme.typography.titleMedium, styles.sectionTitle]}>
              <MaterialCommunityIcons name="information" size={20} /> Match Details
            </Text>
            
            <Input
              label="Match Title"
              value={formData.title}
              onChangeText={(text) => updateField('title', text)}
              placeholder="e.g., Weekend Basketball Game"
              leftIcon="trophy"
              error={errors.title}
            />

            <View style={styles.inputContainer}>
              <Text style={[theme.typography.labelLarge, styles.label]}>
                Sport *
              </Text>
              <View style={styles.sportGrid}>
                {SPORTS.map((sport) => (
                  <Chip
                    key={sport.name}
                    label={sport.name}
                    icon={sport.icon}
                    selected={formData.sport === sport.name}
                    onPress={() => updateField('sport', sport.name)}
                    variant={formData.sport === sport.name ? 'filled' : 'outlined'}
                    style={styles.sportChip}
                  />
                ))}
              </View>
              {errors.sport ? (
                <Text style={[theme.typography.bodySmall, styles.error]}>
                  {errors.sport}
                </Text>
              ) : null}
            </View>

            <Input
              label="Description (Optional)"
              value={formData.description}
              onChangeText={(text) => updateField('description', text)}
              placeholder="Tell players about this match"
              leftIcon="text"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </Card>
        </FadeInDown>

        <FadeInDown delay={300} duration={400}>
          <Card style={styles.card}>
            <Text style={[theme.typography.titleMedium, styles.sectionTitle]}>
              <MaterialCommunityIcons name="calendar-clock" size={20} /> Schedule
            </Text>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  label="Date"
                  value={formData.date}
                  onChangeText={(text) => updateField('date', text)}
                  placeholder="YYYY-MM-DD"
                  leftIcon="calendar"
                  error={errors.date}
                  helperText="Format: YYYY-MM-DD"
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label="Time"
                  value={formData.time}
                  onChangeText={(text) => updateField('time', text)}
                  placeholder="HH:MM"
                  leftIcon="clock-outline"
                  error={errors.time}
                  helperText="24h format"
                />
              </View>
            </View>
          </Card>
        </FadeInDown>

        <FadeInDown delay={400} duration={400}>
          <Card style={styles.card}>
            <Text style={[theme.typography.titleMedium, styles.sectionTitle]}>
              <MaterialCommunityIcons name="account-group" size={20} /> Participants
            </Text>

            <Input
              label="Maximum Participants"
              value={formData.maxParticipants}
              onChangeText={(text) => updateField('maxParticipants', text)}
              placeholder="e.g., 10"
              leftIcon="account-multiple"
              keyboardType="numeric"
              error={errors.maxParticipants}
              helperText="Min: 2, Max: 100"
            />
          </Card>
        </FadeInDown>

        {venues.length > 0 && (
          <FadeInDown delay={500} duration={400}>
            <Card style={styles.card}>
              <Text style={[theme.typography.titleMedium, styles.sectionTitle]}>
                <MaterialCommunityIcons name="map-marker" size={20} /> Venue (Optional)
              </Text>
              <View style={styles.venueList}>
                {venues.slice(0, 5).map((venue) => (
                  <Chip
                    key={venue.id}
                    label={venue.name}
                    icon="map-marker"
                    selected={formData.venueId === venue.id}
                    onPress={() => updateField('venueId', venue.id)}
                    variant={formData.venueId === venue.id ? 'filled' : 'outlined'}
                    style={styles.venueChip}
                  />
                ))}
              </View>
            </Card>
          </FadeInDown>
        )}

        <FadeInDown delay={600} duration={400}>
          <View style={styles.buttonContainer}>
            <Button
              title="Create Match"
              onPress={handleCreate}
              loading={isLoading}
              leftIcon="check"
              style={styles.createButton}
            />

            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              leftIcon="close"
            />
          </View>
        </FadeInDown>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: theme.spacing.base,
      paddingBottom: theme.spacing.xl,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    iconContainer: {
      marginBottom: theme.spacing.sm,
    },
    title: {
      color: theme.colors.onBackground,
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
    },
    subtitle: {
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
    },
    card: {
      marginBottom: theme.spacing.base,
      padding: theme.spacing.base,
    },
    sectionTitle: {
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.base,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    inputContainer: {
      marginBottom: theme.spacing.base,
    },
    label: {
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.sm,
    },
    sportGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    sportChip: {
      marginBottom: theme.spacing.xs,
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    halfWidth: {
      flex: 1,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    venueList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    venueChip: {
      marginBottom: theme.spacing.xs,
    },
    buttonContainer: {
      gap: theme.spacing.sm,
    },
    createButton: {
      marginBottom: theme.spacing.xs,
    },
    error: {
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
  });

export default CreateMatchScreen;
