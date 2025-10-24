/**
 * Error helper functions for error mapping and user-friendly messages
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

/**
 * HTTP status code to user-friendly message
 */
const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your input.',
  401: 'You need to log in to continue.',
  403: 'You don\'t have permission to perform this action.',
  404: 'The requested resource was not found.',
  408: 'Request timeout. Please try again.',
  409: 'This operation conflicts with existing data.',
  422: 'The provided data is invalid.',
  429: 'Too many requests. Please try again later.',
  500: 'Server error. Please try again later.',
  502: 'Bad gateway. Please try again later.',
  503: 'Service temporarily unavailable.',
  504: 'Gateway timeout. Please try again.',
};

/**
 * Get user-friendly error message from HTTP status code
 */
export const getHttpErrorMessage = (statusCode: number, defaultMessage?: string): string => {
  return HTTP_ERROR_MESSAGES[statusCode] || defaultMessage || 'An unexpected error occurred.';
};

/**
 * Map API error to user-friendly message
 */
export const mapApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    const statusCode = error.response.status;
    const serverMessage = error.response.data?.message;
    
    return serverMessage || getHttpErrorMessage(statusCode);
  } else if (error.request) {
    // Request was made but no response
    return 'Unable to reach the server. Please check your internet connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Map network error to user-friendly message
 */
export const mapNetworkError = (error: any): string => {
  if (error.message === 'Network request failed') {
    return 'Network error. Please check your internet connection.';
  }
  
  if (error.message.includes('timeout')) {
    return 'Request timeout. Please try again.';
  }
  
  return 'Network error. Please try again.';
};

/**
 * Get validation error messages from API response
 */
export const getValidationErrors = (error: any): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (error.response?.data?.errors) {
    const apiErrors = error.response.data.errors;
    
    if (Array.isArray(apiErrors)) {
      apiErrors.forEach((err: any) => {
        if (err.field && err.message) {
          errors[err.field] = err.message;
        }
      });
    } else if (typeof apiErrors === 'object') {
      Object.keys(apiErrors).forEach(field => {
        const message = apiErrors[field];
        errors[field] = Array.isArray(message) ? message[0] : message;
      });
    }
  }
  
  return errors;
};

/**
 * Create AppError from any error
 */
export const createAppError = (error: any, defaultCode: string = 'UNKNOWN_ERROR'): AppError => {
  if (error.response) {
    return {
      code: `HTTP_${error.response.status}`,
      message: mapApiError(error),
      details: error.response.data,
    };
  }
  
  return {
    code: error.code || defaultCode,
    message: error.message || 'An unexpected error occurred.',
    details: error,
  };
};

/**
 * Log error with context
 */
export const logError = (error: any, context?: string): void => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    error: createAppError(error),
  };
  
  console.error('Error:', errorInfo);
  
  // Here you could send to error tracking service (Sentry, etc.)
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401;
};

/**
 * Check if error is authorization error
 */
export const isAuthorizationError = (error: any): boolean => {
  return error.response?.status === 403;
};

/**
 * Check if error is validation error
 */
export const isValidationError = (error: any): boolean => {
  return error.response?.status === 422 || error.response?.status === 400;
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error: any): boolean => {
  return !error.response && (error.request || error.message === 'Network request failed');
};

/**
 * Check if error is server error
 */
export const isServerError = (error: any): boolean => {
  const status = error.response?.status;
  return status >= 500 && status < 600;
};

/**
 * Retry operation with error handling
 */
export const retryOnError = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  shouldRetry: (error: any) => boolean = isNetworkError
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1 && shouldRetry(error)) {
        await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
};

/**
 * Handle error with callback
 */
export const handleError = (
  error: any,
  onAuth?: () => void,
  onNetwork?: () => void,
  onValidation?: (errors: Record<string, string>) => void,
  onGeneric?: (message: string) => void
): void => {
  if (isAuthError(error) && onAuth) {
    onAuth();
  } else if (isNetworkError(error) && onNetwork) {
    onNetwork();
  } else if (isValidationError(error) && onValidation) {
    const errors = getValidationErrors(error);
    onValidation(errors);
  } else if (onGeneric) {
    const message = mapApiError(error);
    onGeneric(message);
  }
  
  logError(error);
};

/**
 * Format error for display
 */
export const formatErrorForDisplay = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  return 'An unexpected error occurred.';
};

/**
 * Get error code from error
 */
export const getErrorCode = (error: any): string => {
  if (error.code) {
    return error.code;
  }
  
  if (error.response?.status) {
    return `HTTP_${error.response.status}`;
  }
  
  return 'UNKNOWN_ERROR';
};

/**
 * Check if error should show to user
 */
export const shouldShowError = (error: any): boolean => {
  // Don't show cancelled requests
  if (error.message === 'Request cancelled') {
    return false;
  }
  
  // Don't show aborted requests
  if (error.name === 'AbortError') {
    return false;
  }
  
  return true;
};

/**
 * Get error details for debugging
 */
export const getErrorDetails = (error: any): Record<string, any> => {
  return {
    message: error.message,
    code: getErrorCode(error),
    stack: error.stack,
    response: error.response?.data,
    status: error.response?.status,
    url: error.config?.url,
    method: error.config?.method,
  };
};
