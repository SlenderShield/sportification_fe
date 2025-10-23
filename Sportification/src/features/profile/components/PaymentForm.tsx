import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { useTranslation } from 'react-i18next';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  clientSecret: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  billingDetails?: {
    email?: string;
    name?: string;
  };
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency = 'USD',
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  billingDetails,
}) => {
  const { t } = useTranslation();
  const { confirmPayment, loading } = useConfirmPayment();
  const [cardComplete, setCardComplete] = useState(false);

  const handlePayment = async () => {
    if (!cardComplete) {
      Alert.alert('Error', 'Please enter complete card details');
      return;
    }

    try {
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: billingDetails || {},
        },
      });

      if (error) {
        onPaymentError(error.message || 'Payment failed');
      } else if (paymentIntent) {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (err) {
      onPaymentError(err instanceof Error ? err.message : 'Payment failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>{t('payments.amount')}</Text>
        <Text style={styles.amountValue}>
          {currency} {(amount / 100).toFixed(2)}
        </Text>
      </View>

      <View style={styles.cardFieldContainer}>
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={styles.card}
          style={styles.cardField}
          onCardChange={(cardDetails) => {
            setCardComplete(cardDetails.complete);
          }}
        />
      </View>

      <TouchableOpacity
        style={[styles.payButton, (!cardComplete || loading) && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={!cardComplete || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>{t('payments.payNow')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  amountLabel: {
    fontSize: 16,
    color: '#666',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  cardFieldContainer: {
    marginBottom: 24,
  },
  cardField: {
    width: '100%',
    height: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  payButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentForm;
