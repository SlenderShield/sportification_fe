import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { logger } from '@core/types/ILogger';

/**
 * FeatureErrorBoundary
 * 
 * Specialized error boundary for feature modules
 * Provides feature-specific error handling and logging
 * 
 * @example
 * ```tsx
 * <FeatureErrorBoundary feature="matches">
 *   <MatchesNavigator />
 * </FeatureErrorBoundary>
 * ```
 */

interface FeatureErrorBoundaryProps {
  /** Feature name */
  feature: string;
  /** Child components */
  children: ReactNode;
  /** Optional custom fallback */
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

export const FeatureErrorBoundary: React.FC<FeatureErrorBoundaryProps> = ({
  feature,
  children,
  fallback,
}) => {
  const handleError = (error: Error) => {
    logger.error(`Feature error in ${feature}`, {
      feature,
      error: error.message,
      stack: error.stack,
    });

    // Here you could also:
    // - Send error to analytics
    // - Show a toast notification
    // - Navigate to an error screen
  };

  return (
    <ErrorBoundary
      feature={feature}
      fallback={fallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};
