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
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface CreateTournamentScreenProps {
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

const FORMATS = [
  'single-elimination',
  'double-elimination',
  'round-robin',
  'swiss',
];

const CreateTournamentScreen: React.FC<CreateTournamentScreenProps> = ({ navigation }) => {
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
    let valid = true;
    const newErrors = { name: '', sport: '', format: '', startDate: '', maxParticipants: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Tournament name is required';
      valid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
      valid = false;
    }

    if (!formData.sport.trim()) {
      newErrors.sport = 'Sport is required';
      valid = false;
    }

    if (!formData.format.trim()) {
      newErrors.format = 'Format is required';
      valid = false;
    }

    if (!formData.startDate.trim()) {
      newErrors.startDate = 'Start date is required';
      valid = false;
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.startDate)) {
        newErrors.startDate = 'Date must be in YYYY-MM-DD format';
        valid = false;
      }
    }

    if (!formData.maxParticipants.trim()) {
      newErrors.maxParticipants = 'Maximum participants is required';
      valid = false;
    } else {
      const max = parseInt(formData.maxParticipants, 10);
      if (isNaN(max) || max < 4) {
        newErrors.maxParticipants = 'Maximum participants must be at least 4';
        valid = false;
      } else if (max > 256) {
        newErrors.maxParticipants = 'Maximum participants cannot exceed 256';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Tournament</Text>
          <Text style={styles.subtitle}>
            Organize a competitive tournament
          </Text>

          <Input
            label="Tournament Name *"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            placeholder="e.g., Summer Basketball Championship"
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Format *</Text>
            <View style={styles.formatGrid}>
              {FORMATS.map((format) => (
                <Button
                  key={format}
                  title={format.replace('-', ' ')}
                  onPress={() => updateField('format', format)}
                  variant={formData.format === format ? 'primary' : 'outline'}
                  style={styles.formatButton}
                  textStyle={styles.formatButtonText}
                />
              ))}
            </View>
            {errors.format ? (
              <Text style={styles.error}>{errors.format}</Text>
            ) : null}
          </View>

          <Input
            label="Start Date *"
            value={formData.startDate}
            onChangeText={(text) => updateField('startDate', text)}
            placeholder="YYYY-MM-DD"
            error={errors.startDate}
          />

          <Input
            label="Maximum Participants *"
            value={formData.maxParticipants}
            onChangeText={(text) => updateField('maxParticipants', text)}
            placeholder="e.g., 16"
            keyboardType="numeric"
            error={errors.maxParticipants}
          />

          <Input
            label="Description (Optional)"
            value={formData.description}
            onChangeText={(text) => updateField('description', text)}
            placeholder="Tell participants about this tournament"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <Input
            label="Prize Pool (Optional)"
            value={formData.prizePool}
            onChangeText={(text) => updateField('prizePool', text)}
            placeholder="e.g., $500 cash prize"
          />

          <Button
            title="Create Tournament"
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
  formatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  formatButton: {
    margin: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  formatButtonText: {
    fontSize: 14,
    textTransform: 'capitalize',
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

export default CreateTournamentScreen;
