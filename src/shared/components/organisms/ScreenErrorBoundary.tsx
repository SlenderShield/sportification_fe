import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../atoms/Button';

/**
 * ScreenErrorBoundary
 * 
 * Specialized error boundary for individual screens
 * Provides screen-level error handling with navigation fallback
 * 
 * @example
 * ```tsx
 * <ScreenErrorBoundary
 *   screenName="Match Detail"
 *   onGoBack={() => navigation.goBack()}
 * >
 *   <MatchDetailScreen />
 * </ScreenErrorBoundary>
 * ```
 */

interface ScreenErrorBoundaryProps {
  /** Screen name for context */
  screenName: string;
  /** Child components */
  children: ReactNode;
  /** Go back callback */
  onGoBack?: () => void;
  /** Go to home callback */
  onGoHome?: () => void;
}

export const ScreenErrorBoundary: React.FC<ScreenErrorBoundaryProps> = ({
  screenName,
  children,
  onGoBack,
  onGoHome,
}) => {
  const renderFallback = (error: Error, resetError: () => void) => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>😕</Text>
        <Text style={styles.title}>Unable to load {screenName}</Text>
        <Text style={styles.message}>
          We encountered an error while loading this screen.
        </Text>
        
        {__DEV__ && (
          <View style={styles.errorDetails}>
            <Text style={styles.errorMessage}>{error.message}</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <Button
            label="Try Again"
            onPress={resetError}
            variant="primary"
            style={styles.button}
          />
          
          {onGoBack && (
            <Button
              label="Go Back"
              onPress={onGoBack}
              variant="secondary"
              style={styles.button}
            />
          )}
          
          {onGoHome && (
            <Button
              label="Go Home"
              onPress={onGoHome}
              variant="secondary"
              style={styles.button}
            />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <ErrorBoundary
      feature={screenName}
      fallback={renderFallback}
    >
      {children}
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 32,
    maxWidth: 400,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  errorDetails: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorMessage: {
    fontSize: 12,
    color: '#d32f2f',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
  },
});
