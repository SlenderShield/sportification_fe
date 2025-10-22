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
import { useTranslation } from 'react-i18next';
import { useCreateBookingMutation, useCheckAvailabilityMutation } from '../../store/api/venueApi';
import { useCreatePaymentIntentMutation, useConfirmPaymentMutation } from '../../store/api/paymentApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import PaymentForm from '../../components/payment/PaymentForm';
import { analyticsService } from '../../services/analyticsService';

interface CreateBookingScreenProps {
  navigation: any;
  route: any;
}

const CreateBookingScreen: React.FC<CreateBookingScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { venueId, venueName } = route.params;
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [bookingId, setBookingId] = useState<string>('');
  const [paymentClientSecret, setPaymentClientSecret] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [formData, setFormData] = useState({
    sport: '',
    date: '',
    startTime: '',
    endTime: '',
    participants: '',
    notes: '',
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
  const [createPaymentIntent, { isLoading: isCreatingIntent }] = useCreatePaymentIntentMutation();
  const [confirmPayment] = useConfirmPaymentMutation();

  const validate = (): boolean => {
    let valid = true;
    const newErrors = { sport: '', date: '', startTime: '', endTime: '', participants: '' };

    if (!formData.sport.trim()) {
      newErrors.sport = t('errors.required');
      valid = false;
    }

    if (!formData.date.trim()) {
      newErrors.date = t('errors.required');
      valid = false;
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.date)) {
        newErrors.date = 'Date must be in YYYY-MM-DD format';
        valid = false;
      }
    }

    if (!formData.startTime.trim()) {
      newErrors.startTime = t('errors.required');
      valid = false;
    } else {
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(formData.startTime)) {
        newErrors.startTime = 'Time must be in HH:MM format (24h)';
        valid = false;
      }
    }

    if (!formData.endTime.trim()) {
      newErrors.endTime = t('errors.required');
      valid = false;
    } else {
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(formData.endTime)) {
        newErrors.endTime = 'Time must be in HH:MM format (24h)';
        valid = false;
      }
    }

    if (!formData.participants.trim()) {
      newErrors.participants = t('errors.required');
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
      Alert.alert(t('common.error'), 'Please fill in date, start time, and end time');
      return;
    }

    try {
      const result = await checkAvailability({
        venueId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
      }).unwrap();

      if (result.success && result.data?.available) {
        Alert.alert('Available', 'This time slot is available!');
      } else {
        Alert.alert('Unavailable', 'This time slot is not available. Please choose another time.');
      }
    } catch (error: any) {
      Alert.alert(t('common.error'), error?.data?.message || 'Failed to check availability');
    }
  };

  const handleProceedToPayment = async () => {
    if (!validate()) return;

    try {
      const bookingData: any = {
        venueId,
        sport: formData.sport.trim(),
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        participants: parseInt(formData.participants, 10),
        notes: formData.notes.trim() || undefined,
      };

      const result = await createBooking(bookingData).unwrap();

      if (result.success && result.data) {
        const booking = result.data;
        setBookingId(booking._id);
        setTotalAmount(booking.pricing?.totalCost || 0);

        // Create payment intent
        const paymentResult = await createPaymentIntent({
          amount: booking.pricing?.totalCost || 0,
          currency: booking.pricing?.currency || 'USD',
          bookingId: booking._id,
          metadata: {
            venueId,
            venueName: venueName || 'Venue',
            sport: formData.sport,
          },
        }).unwrap();

        setPaymentClientSecret(paymentResult.clientSecret);
        setStep('payment');

        // Log analytics
        await analyticsService.logVenueBooking(venueId, booking.pricing?.totalCost || 0);
      }
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error?.data?.message || 'Failed to create booking. Please try again.'
      );
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      await confirmPayment({
        paymentIntentId,
        bookingId,
      }).unwrap();

      // Log analytics
      await analyticsService.logPayment(totalAmount, 'USD', 'card');

      Alert.alert(
        t('common.success'),
        t('payments.paymentSuccessful') + '\nBooking confirmed!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MyBookings'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(t('common.error'), 'Booking created but payment confirmation failed');
    }
  };

  const handlePaymentError = (error: string) => {
    Alert.alert(t('payments.paymentFailed'), error);
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  if (step === 'payment') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>{t('payments.payNow')}</Text>
            <Text style={styles.subtitle}>Complete your booking payment</Text>

            <View style={styles.bookingSummary}>
              <Text style={styles.summaryLabel}>{t('matches.sport')}:</Text>
              <Text style={styles.summaryValue}>{formData.sport}</Text>
              
              <Text style={styles.summaryLabel}>Date & Time:</Text>
              <Text style={styles.summaryValue}>
                {formData.date} at {formData.startTime} - {formData.endTime}
              </Text>
              
              <Text style={styles.summaryLabel}>{t('tournaments.participants')}:</Text>
              <Text style={styles.summaryValue}>{formData.participants}</Text>
            </View>

            <PaymentForm
              amount={totalAmount}
              currency="USD"
              clientSecret={paymentClientSecret}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />

            <Button
              title={t('common.cancel')}
              onPress={() => setStep('details')}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('venues.bookVenue')}</Text>
          <Text style={styles.subtitle}>Reserve a time slot at {venueName || 'this venue'}</Text>

          <Input
            label={`${t('matches.sport')} *`}
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
            label={`${t('tournaments.participants')} *`}
            value={formData.participants}
            onChangeText={(text) => updateField('participants', text)}
            placeholder="e.g., 10"
            keyboardType="numeric"
            error={errors.participants}
          />

          <Input
            label="Notes (Optional)"
            value={formData.notes}
            onChangeText={(text) => updateField('notes', text)}
            placeholder="Any special requests or notes"
            multiline
            numberOfLines={3}
          />

          <Button
            title={t('venues.checkAvailability')}
            onPress={handleCheckAvailability}
            loading={isChecking}
            variant="outline"
            style={styles.checkButton}
          />

          <Button
            title="Proceed to Payment"
            onPress={handleProceedToPayment}
            loading={isLoading || isCreatingIntent}
            style={styles.createButton}
          />

          <Button
            title={t('common.cancel')}
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
  bookingSummary: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cancelButton: {
    marginTop: 16,
  },
});

export default CreateBookingScreen;
