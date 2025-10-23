/**
 * Base error class for application errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Error for network-related issues
 */
export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred', details?: any) {
    super(message, 'NETWORK_ERROR', 0, details);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Error for authentication failures
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, 'AUTH_ERROR', 401, details);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Error for authorization failures
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized', details?: any) {
    super(message, 'AUTHORIZATION_ERROR', 403, details);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Error for validation failures
 */
export class ValidationError extends AppError {
  constructor(
    message: string = 'Validation failed',
    public errors?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400, errors);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error for business logic violations
 */
export class BusinessError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'BUSINESS_ERROR', 422, details);
    this.name = 'BusinessError';
    Object.setPrototypeOf(this, BusinessError.prototype);
  }
}

/**
 * Error for resource not found
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 'NOT_FOUND', 404, details);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Error handler utility
 */
export class ErrorHandler {
  /**
   * Convert unknown error to AppError
   */
  static normalize(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(error.message);
    }

    if (typeof error === 'string') {
      return new AppError(error);
    }

    return new AppError('An unknown error occurred');
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: unknown): string {
    const appError = this.normalize(error);

    // Map technical errors to user-friendly messages
    switch (appError.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect. Please check your internet connection.';
      case 'AUTH_ERROR':
        return 'Please log in to continue.';
      case 'AUTHORIZATION_ERROR':
        return "You don't have permission to perform this action.";
      case 'VALIDATION_ERROR':
        return appError.message || 'Please check your input and try again.';
      case 'NOT_FOUND':
        return 'The requested resource was not found.';
      default:
        return appError.message || 'An unexpected error occurred.';
    }
  }

  /**
   * Check if error is retriable
   */
  static isRetriable(error: unknown): boolean {
    const appError = this.normalize(error);
    return (
      appError instanceof NetworkError ||
      (appError.statusCode !== undefined &&
        appError.statusCode >= 500 &&
        appError.statusCode < 600)
    );
  }
}
