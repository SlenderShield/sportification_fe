import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { EmptyState } from '../molecules/EmptyState';
import { Button } from '../atoms/Button';
import { LottieLoader } from '../atoms/LottieLoader';

/**
 * EmptyScreenTemplate
 * 
 * Reusable template for empty state screens with common features:
 * - Icon or Lottie animation
 * - Title and message
 * - Primary and secondary action buttons
 * - Customizable styling
 * 
 * @example
 * ```tsx
 * <EmptyScreenTemplate
 *   icon="sports-basketball"
 *   title="No Teams Yet"
 *   message="Create your first team to get started playing with others"
 *   primaryAction={{ label: 'Create Team', onPress: handleCreate }}
 *   secondaryAction={{ label: 'Browse Teams', onPress: handleBrowse }}
 * />
 * ```
 */

export interface Action {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface EmptyScreenTemplateProps {
  /** Icon name (optional) */
  icon?: string;
  /** Lottie animation source (optional) */
  lottieSource?: any;
  /** Title text */
  title: string;
  /** Description message */
  message: string;
  /** Primary action button */
  primaryAction?: Action;
  /** Secondary action button */
  secondaryAction?: Action;
  /** Additional content */
  children?: React.ReactNode;
}

export const EmptyScreenTemplate: React.FC<EmptyScreenTemplateProps> = ({
  icon,
  lottieSource,
  title,
  message,
  primaryAction,
  secondaryAction,
  children,
}) => {
  const renderIllustration = () => {
    if (lottieSource) {
      return (
        <LottieLoader
          source={lottieSource}
          autoPlay
          loop
          style={styles.lottie}
        />
      );
    }

    if (icon) {
      return (
        <EmptyState
          icon={icon}
          message=""
        />
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderIllustration()}
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        
        {children}
        
        {(primaryAction || secondaryAction) && (
          <View style={styles.actionsContainer}>
            {primaryAction && (
              <Button
                label={primaryAction.label}
                onPress={primaryAction.onPress}
                variant={primaryAction.variant || 'primary'}
                style={styles.actionButton}
              />
            )}
            
            {secondaryAction && (
              <Button
                label={secondaryAction.label}
                onPress={secondaryAction.onPress}
                variant={secondaryAction.variant || 'secondary'}
                style={styles.actionButton}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  lottie: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    width: '100%',
  },
});
