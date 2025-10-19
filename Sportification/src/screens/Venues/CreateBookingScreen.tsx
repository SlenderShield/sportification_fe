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
import { useCreateBookingMutation, useCheckAvailabilityMutation } from '../../store/api/venueApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface CreateBookingScreenProps {
  navigation: any;
  route: any;
}

const CreateBookingScreen: React.FC<CreateBookingScreenProps> = ({ navigation, route }) => {
  const { venueId } = route.params;
  const [formData, setFormData] = useState({
    sport: '',
    date: '',
    startTime: '',
    endTime: '',
    participants: '',
    promoCode: '',
  });
  const [errors, setErrors] = useState({
    sport: '',
    date: '',
    startTime: '',
    endTime: '',
    participants: '',
  });

  const [createBooking, { isLoading }] = useCreateBookingMutation();
  const [checkAvailability, { isLoading: isChecking }] = useCheckAvailabilityMutation();

  const validate = (): boolean => {
    let valid = true;
    const newErrors = { sport: '', date: '', startTime: '', endTime: '', participants: '' };

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

    if (!formData.startTime.trim()) {
      newErrors.startTime = 'Start time is required';
      valid = false;
    } else {
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(formData.startTime)) {
        newErrors.startTime = 'Time must be in HH:MM format (24h)';
        valid = false;
      }
    }

    if (!formData.endTime.trim()) {
      newErrors.endTime = 'End time is required';
      valid = false;
    } else {
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(formData.endTime)) {
        newErrors.endTime = 'Time must be in HH:MM format (24h)';
        valid = false;
      }
    }

    if (!formData.participants.trim()) {
      newErrors.participants = 'Number of participants is required';
      valid = false;
    } else {
      const num = parseInt(formData.participants, 10);
      if (isNaN(num) || num < 1) {
        newErrors.participants = 'Must be at least 1 participant';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCheckAvailability = async () => {
    if (!formData.date || !formData.startTime || !formData.endTime) {
      Alert.alert('Error', 'Please fill in date, start time, and end time');
      return;
    }

    try {
      const startDateTime = `${formData.date}T${formData.startTime}:00.000Z`;
      const endDateTime = `${formData.date}T${formData.endTime}:00.000Z`;

      const result = await checkAvailability({
        venueId,
        startTime: startDateTime,
        endTime: endDateTime,
      }).unwrap();

      if (result.success && result.data?.available) {
        Alert.alert('Available', 'This time slot is available!');
      } else {
        Alert.alert('Unavailable', 'This time slot is not available. Please choose another time.');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to check availability');
    }
  };

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      const startDateTime = `${formData.date}T${formData.startTime}:00.000Z`;
      const endDateTime = `${formData.date}T${formData.endTime}:00.000Z`;

      const bookingData: any = {
        venueId,
        sport: formData.sport.trim(),
        startTime: startDateTime,
        endTime: endDateTime,
        numberOfParticipants: parseInt(formData.participants, 10),
        promoCode: formData.promoCode.trim() || undefined,
      };

      const result = await createBooking(bookingData).unwrap();

      if (result.success) {
        Alert.alert('Success', 'Booking created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to create booking. Please try again.'
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
          <Text style={styles.title}>Create Booking</Text>
          <Text style={styles.subtitle}>Reserve a time slot at this venue</Text>

          <Input
            label="Sport *"
            value={formData.sport}
            onChangeText={(text) => updateField('sport', text)}
            placeholder="e.g., Basketball"
            error={errors.sport}
          />

          <Input
            label="Date *"
            value={formData.date}
            onChangeText={(text) => updateField('date', text)}
            placeholder="YYYY-MM-DD"
            error={errors.date}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="Start Time *"
                value={formData.startTime}
                onChangeText={(text) => updateField('startTime', text)}
                placeholder="HH:MM (24h)"
                error={errors.startTime}
              />
            </View>
            <View style={styles.halfWidth}>
              <Input
                label="End Time *"
                value={formData.endTime}
                onChangeText={(text) => updateField('endTime', text)}
                placeholder="HH:MM (24h)"
                error={errors.endTime}
              />
            </View>
          </View>

          <Input
            label="Number of Participants *"
            value={formData.participants}
            onChangeText={(text) => updateField('participants', text)}
            placeholder="e.g., 10"
            keyboardType="numeric"
            error={errors.participants}
          />

          <Input
            label="Promo Code (Optional)"
            value={formData.promoCode}
            onChangeText={(text) => updateField('promoCode', text)}
            placeholder="Enter promo code if you have one"
          />

          <Button
            title="Check Availability"
            onPress={handleCheckAvailability}
            loading={isChecking}
            variant="outline"
            style={styles.checkButton}
          />

          <Button
            title="Create Booking"
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
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  halfWidth: {
    flex: 1,
    paddingHorizontal: 8,
  },
  checkButton: {
    marginBottom: 12,
  },
  createButton: {
    marginBottom: 12,
  },
});

export default CreateBookingScreen;
