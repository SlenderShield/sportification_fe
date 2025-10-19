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

interface CreateMatchScreenProps {
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

const CreateMatchScreen: React.FC<CreateMatchScreenProps> = ({ navigation }) => {
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

  const validate = (): boolean => {
    let valid = true;
    const newErrors = { title: '', sport: '', date: '', time: '', maxParticipants: '' };

    if (!formData.title.trim()) {
      newErrors.title = 'Match title is required';
      valid = false;
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
      valid = false;
    }

    if (!formData.sport.trim()) {
      newErrors.sport = 'Sport is required';
      valid = false;
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
      valid = false;
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.date)) {
        newErrors.date = 'Date must be in YYYY-MM-DD format';
        valid = false;
      }
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
      valid = false;
    } else {
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(formData.time)) {
        newErrors.time = 'Time must be in HH:MM format (24h)';
        valid = false;
      }
    }

    if (!formData.maxParticipants.trim()) {
      newErrors.maxParticipants = 'Maximum participants is required';
      valid = false;
    } else {
      const max = parseInt(formData.maxParticipants, 10);
      if (isNaN(max) || max < 2) {
        newErrors.maxParticipants = 'Maximum participants must be at least 2';
        valid = false;
      } else if (max > 100) {
        newErrors.maxParticipants = 'Maximum participants cannot exceed 100';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
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
        <View style={styles.content}>
          <Text style={styles.title}>Create New Match</Text>
          <Text style={styles.subtitle}>
            Organize a sports match and invite players
          </Text>

          <Input
            label="Match Title *"
            value={formData.title}
            onChangeText={(text) => updateField('title', text)}
            placeholder="e.g., Weekend Basketball Game"
            error={errors.title}
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

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="Date *"
                value={formData.date}
                onChangeText={(text) => updateField('date', text)}
                placeholder="YYYY-MM-DD"
                error={errors.date}
              />
            </View>
            <View style={styles.halfWidth}>
              <Input
                label="Time *"
                value={formData.time}
                onChangeText={(text) => updateField('time', text)}
                placeholder="HH:MM (24h)"
                error={errors.time}
              />
            </View>
          </View>

          <Input
            label="Description (Optional)"
            value={formData.description}
            onChangeText={(text) => updateField('description', text)}
            placeholder="Tell players about this match"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          {venues.length > 0 && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Venue (Optional)</Text>
              <View style={styles.venueList}>
                {venues.slice(0, 5).map((venue) => (
                  <Button
                    key={venue.id}
                    title={venue.name}
                    onPress={() => updateField('venueId', venue.id)}
                    variant={formData.venueId === venue.id ? 'primary' : 'outline'}
                    style={styles.venueButton}
                    textStyle={styles.venueButtonText}
                  />
                ))}
              </View>
            </View>
          )}

          <Input
            label="Maximum Participants *"
            value={formData.maxParticipants}
            onChangeText={(text) => updateField('maxParticipants', text)}
            placeholder="e.g., 10"
            keyboardType="numeric"
            error={errors.maxParticipants}
          />

          <Button
            title="Create Match"
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
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  halfWidth: {
    flex: 1,
    paddingHorizontal: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  venueList: {
    marginTop: 8,
  },
  venueButton: {
    marginBottom: 8,
  },
  venueButtonText: {
    fontSize: 14,
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

export default CreateMatchScreen;
