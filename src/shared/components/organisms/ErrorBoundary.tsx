import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../atoms/Button';
import { logger } from '@core/types/ILogger';

/**
 * ErrorBoundary
 * 
 * React error boundary component for graceful error handling
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, reset) => (
 *     <CustomErrorView error={error} onReset={reset} />
 *   )}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */

interface ErrorBoundaryProps {
  /** Child components */
  children: ReactNode;
  /** Optional custom fallback render function */
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  /** Optional error handler callback */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Feature name for logging context */
  feature?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { feature, onError } = this.props;

    // Log the error
    logger.error('Error caught by ErrorBoundary', {
      feature,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Call custom error handler if provided
    onError?.(error, errorInfo);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, this.resetError);
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>⚠️</Text>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We encountered an unexpected error. Please try again.
            </Text>
            
            {__DEV__ && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Error Details:</Text>
                <Text style={styles.errorMessage}>{error.message}</Text>
              </View>
            )}
            
            <Button
              label="Try Again"
              onPress={this.resetError}
              variant="primary"
              style={styles.button}
            />
          </View>
        </View>
      );
    }

    return children;
  }
}

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
  errorDetails: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  button: {
    width: '100%',
  },
});
