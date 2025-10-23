import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

/**
 * Haptic Feedback Utility
 * Provides consistent haptic feedback across the app
 */

// Configuration for haptic feedback
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

/**
 * Trigger light impact feedback
 * Use for: Button presses, chip selections, icon button presses
 */
export const triggerLightImpact = () => {
  ReactNativeHapticFeedback.trigger('impactLight', options);
};

/**
 * Trigger medium impact feedback
 * Use for: Important actions, confirmations
 */
export const triggerMediumImpact = () => {
  ReactNativeHapticFeedback.trigger('impactMedium', options);
};

/**
 * Trigger heavy impact feedback
 * Use for: Critical actions, deletions
 */
export const triggerHeavyImpact = () => {
  ReactNativeHapticFeedback.trigger('impactHeavy', options);
};

/**
 * Trigger success notification feedback
 * Use for: Successful operations, confirmations
 */
export const triggerSuccessNotification = () => {
  ReactNativeHapticFeedback.trigger('notificationSuccess', options);
};

/**
 * Trigger warning notification feedback
 * Use for: Warning messages, caution states
 */
export const triggerWarningNotification = () => {
  ReactNativeHapticFeedback.trigger('notificationWarning', options);
};

/**
 * Trigger error notification feedback
 * Use for: Error messages, failed operations
 */
export const triggerErrorNotification = () => {
  ReactNativeHapticFeedback.trigger('notificationError', options);
};

/**
 * Trigger selection feedback
 * Use for: Selections, toggles
 */
export const triggerSelection = () => {
  ReactNativeHapticFeedback.trigger('selection', options);
};
