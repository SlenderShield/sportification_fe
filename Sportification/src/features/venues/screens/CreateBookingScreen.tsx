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
import { useTheme } from '../../theme';
import { Button } from '@shared/components/atoms';
import { Input } from '@shared/components/atoms';
import { Card } from '../../components/ui';
import { Icon } from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import PaymentForm from '../../components/payment/PaymentForm';
import { analyticsService } from '@shared/services/analyticsService';

interface CreateBookingScreenProps {
  navigation: any;
  route: any;
}

const CreateBookingScreen: React.FC<CreateBookingScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
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
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Animated.View entering={FadeInDown.duration(300).delay(100)} style={styles.header}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.success + '20' }]}>
                <Icon name="credit-card" size={48} color={theme.colors.success} />
              </View>
              <Text style={[styles.title, theme.typography.displaySmall, { color: theme.colors.text }]}>
                {t('payments.payNow')}
              </Text>
              <Text style={[styles.subtitle, theme.typography.bodyMedium, { color: theme.colors.textSecondary }]}>
                Complete your booking payment
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(300).delay(200)}>
              <Card style={styles.summaryCard}>
                <Text style={[styles.summaryTitle, theme.typography.titleLarge, { color: theme.colors.text }]}>
                  Booking Summary
                </Text>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, theme.typography.labelMedium, { color: theme.colors.textSecondary }]}>
                    {t('matches.sport')}:
                  </Text>
                  <Text style={[styles.summaryValue, theme.typography.bodyLarge, { color: theme.colors.text }]}>
                    {formData.sport}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, theme.typography.labelMedium, { color: theme.colors.textSecondary }]}>
                    Date & Time:
                  </Text>
                  <Text style={[styles.summaryValue, theme.typography.bodyLarge, { color: theme.colors.text }]}>
                    {formData.date} at {formData.startTime} - {formData.endTime}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, theme.typography.labelMedium, { color: theme.colors.textSecondary }]}>
                    {t('tournaments.participants')}:
                  </Text>
                  <Text style={[styles.summaryValue, theme.typography.bodyLarge, { color: theme.colors.text }]}>
                    {formData.participants}
                  </Text>
                </View>
              </Card>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(300).delay(300)}>
              <PaymentForm
                amount={totalAmount}
                currency="USD"
                clientSecret={paymentClientSecret}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(300).delay(400)}>
              <Button
                title={t('common.cancel')}
                icon="close"
                onPress={() => setStep('details')}
                variant="outline"
                style={styles.cancelButton}
              />
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(300).delay(100)} style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.success + '20' }]}>
              <Icon name="calendar-plus" size={48} color={theme.colors.success} />
            </View>
            <Text style={[styles.title, theme.typography.displaySmall, { color: theme.colors.text }]}>
              {t('venues.bookVenue')}
            </Text>
            <Text style={[styles.subtitle, theme.typography.bodyMedium, { color: theme.colors.textSecondary }]}>
              Reserve a time slot at {venueName || 'this venue'}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(300).delay(200)}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="information" size={20} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, theme.typography.titleMedium, { color: theme.colors.text }]}>
                  Booking Details
                </Text>
              </View>

              <Input
                label={`${t('matches.sport')} *`}
                value={formData.sport}
                onChangeText={(text) => updateField('sport', text)}
                placeholder="e.g., Basketball"
                error={errors.sport}
                leftIcon="soccer"
              />

              <Input
                label="Date *"
                value={formData.date}
                onChangeText={(text) => updateField('date', text)}
                placeholder="YYYY-MM-DD"
                error={errors.date}
                helperText="Format: YYYY-MM-DD"
                leftIcon="calendar"
              />

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Input
                    label="Start Time *"
                    value={formData.startTime}
                    onChangeText={(text) => updateField('startTime', text)}
                    placeholder="HH:MM (24h)"
                    error={errors.startTime}
                    leftIcon="clock-outline"
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Input
                    label="End Time *"
                    value={formData.endTime}
                    onChangeText={(text) => updateField('endTime', text)}
                    placeholder="HH:MM (24h)"
                    error={errors.endTime}
                    leftIcon="clock-outline"
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
                leftIcon="account-multiple"
              />

              <Input
                label="Notes (Optional)"
                value={formData.notes}
                onChangeText={(text) => updateField('notes', text)}
                placeholder="Any special requests or notes"
                multiline
                numberOfLines={3}
                leftIcon="text"
              />
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(300).delay(300)} style={styles.actions}>
            <Button
              title={t('venues.checkAvailability')}
              icon="calendar-search"
              onPress={handleCheckAvailability}
              loading={isChecking}
              variant="outline"
            />

            <Button
              title="Proceed to Payment"
              icon="arrow-right"
              onPress={handleProceedToPayment}
              loading={isLoading || isCreatingIntent}
            />

            <Button
              title={t('common.cancel')}
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
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  halfWidth: {
    flex: 1,
    paddingHorizontal: 8,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  summaryLabel: {
    marginBottom: 4,
  },
  summaryValue: {
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 16,
  },
});

export default CreateBookingScreen;
