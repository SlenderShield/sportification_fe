/**
 * useConfirmation Hook
 * Reusable hook for showing confirmation dialogs
 * Reduces code duplication across detail screens
 */

import { Alert } from 'react-native';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export const useConfirmation = () => {
  const showConfirmation = (
    options: ConfirmationOptions,
    onConfirm: () => void | Promise<void>
  ): void => {
    const {
      title,
      message,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      destructive = false,
    } = options;

    Alert.alert(title, message, [
      { text: cancelText, style: 'cancel' },
      {
        text: confirmText,
        style: destructive ? 'destructive' : 'default',
        onPress: onConfirm,
      },
    ]);
  };

  return { showConfirmation };
};
