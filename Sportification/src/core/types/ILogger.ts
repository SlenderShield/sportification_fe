/**
 * Log severity levels for categorizing log messages.
 * 
 * Used to control which messages are output based on the configured log level.
 * Levels are ordered from least to most severe: DEBUG < INFO < WARN < ERROR
 * 
 * @enum {string}
 * 
 * @example
 * ```typescript
 * logger.setLevel(LogLevel.WARN); // Only WARN and ERROR messages will be logged
 * ```
 */
export enum LogLevel {
  /** Detailed diagnostic information for debugging */
  DEBUG = 'debug',
  /** General informational messages about application flow */
  INFO = 'info',
  /** Warning messages for potentially harmful situations */
  WARN = 'warn',
  /** Error messages for serious problems */
  ERROR = 'error',
}

/**
 * Structured log entry containing all information about a single log message.
 * 
 * This interface defines the shape of log entries that can be persisted,
 * transmitted, or processed by logging infrastructure.
 * 
 * @interface LogEntry
 * 
 * @property {LogLevel} level - Severity level of the log message
 * @property {string} message - Human-readable log message
 * @property {Date} timestamp - When the log entry was created
 * @property {Record<string, any>} [context] - Optional additional context data
 * @property {Error} [error] - Optional error object for ERROR level logs
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
}

/**
 * Logger interface defining the contract for logging implementations.
 * 
 * Provides methods for logging at different severity levels and configuring
 * the minimum log level. Implementations should filter messages based on
 * the configured level.
 * 
 * @interface ILogger
 * 
 * @example
 * ```typescript
 * // Using the logger
 * logger.debug('User action', { userId: '123', action: 'click' });
 * logger.info('Request completed successfully');
 * logger.warn('Rate limit approaching');
 * logger.error('Failed to fetch data', error, { endpoint: '/api/users' });
 * 
 * // Configure log level
 * logger.setLevel(LogLevel.WARN); // Only warnings and errors will be logged
 * ```
 */
export interface ILogger {
  /**
   * Log a debug message with optional context.
   * Use for detailed diagnostic information useful during development.
   * 
   * @param {string} message - The debug message to log
   * @param {Record<string, any>} [context] - Optional additional context data
   * 
   * @example
   * ```typescript
   * logger.debug('Component rendered', { component: 'UserProfile', props: { userId: '123' } });
   * ```
   */
  debug(message: string, context?: Record<string, any>): void;

  /**
   * Log an informational message with optional context.
   * Use for general application flow information.
   * 
   * @param {string} message - The info message to log
   * @param {Record<string, any>} [context] - Optional additional context data
   * 
   * @example
   * ```typescript
   * logger.info('User logged in successfully', { userId: '123' });
   * ```
   */
  info(message: string, context?: Record<string, any>): void;

  /**
   * Log a warning message with optional context.
   * Use for potentially harmful situations that aren't errors.
   * 
   * @param {string} message - The warning message to log
   * @param {Record<string, any>} [context] - Optional additional context data
   * 
   * @example
   * ```typescript
   * logger.warn('API rate limit approaching', { remaining: 10, limit: 100 });
   * ```
   */
  warn(message: string, context?: Record<string, any>): void;

  /**
   * Log an error message with optional error object and context.
   * Use for serious problems that need immediate attention.
   * 
   * @param {string} message - The error message to log
   * @param {Error} [error] - Optional error object with stack trace
   * @param {Record<string, any>} [context] - Optional additional context data
   * 
   * @example
   * ```typescript
   * try {
   *   await fetchData();
   * } catch (error) {
   *   logger.error('Failed to fetch data', error instanceof Error ? error : undefined, {
   *     endpoint: '/api/users',
   *     retries: 3
   *   });
   * }
   * ```
   */
  error(message: string, error?: Error, context?: Record<string, any>): void;

  /**
   * Set the minimum log level for filtering messages.
   * Only messages at or above this level will be logged.
   * 
   * @param {LogLevel} level - The minimum log level to output
   * 
   * @example
   * ```typescript
   * // In production, only log warnings and errors
   * logger.setLevel(LogLevel.WARN);
   * 
   * // In development, log everything
   * logger.setLevel(LogLevel.DEBUG);
   * ```
   */
  setLevel(level: LogLevel): void;
}

/**
 * Simple console-based logger implementation.
 * 
 * Outputs log messages to the browser/Node.js console with formatted timestamps
 * and structured context. Filters messages based on the configured log level.
 * 
 * Features:
 * - Automatic timestamp formatting
 * - JSON serialization of context objects
 * - Error stack trace capture
 * - Configurable log level filtering
 * 
 * @class ConsoleLogger
 * @implements {ILogger}
 * 
 * @example
 * ```typescript
 * const logger = new ConsoleLogger();
 * logger.setLevel(LogLevel.INFO);
 * logger.debug('This will not be logged');
 * logger.info('This will be logged');
 * ```
 */
export class ConsoleLogger implements ILogger {
  /** Current minimum log level for filtering messages */
  private level: LogLevel = LogLevel.DEBUG;

  /**
   * Set the minimum log level for filtering messages.
   * 
   * @param {LogLevel} level - The minimum log level to output
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Check if a message at the given level should be logged based on current settings.
   * 
   * @private
   * @param {LogLevel} level - The level to check
   * @returns {boolean} True if the message should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  /**
   * Format a log message with timestamp and context.
   * 
   * @private
   * @param {LogLevel} level - Log level for the message
   * @param {string} message - The message to format
   * @param {Record<string, any>} [context] - Optional context data to include
   * @returns {string} Formatted log message
   */
  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Log a debug message with optional context.
   * 
   * @param {string} message - The debug message to log
   * @param {Record<string, any>} [context] - Optional additional context data
   */
  debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  /**
   * Log an informational message with optional context.
   * 
   * @param {string} message - The info message to log
   * @param {Record<string, any>} [context] - Optional additional context data
   */
  info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message, context));
    }
  }

  /**
   * Log a warning message with optional context.
   * 
   * @param {string} message - The warning message to log
   * @param {Record<string, any>} [context] - Optional additional context data
   */
  warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context));
    }
  }

  /**
   * Log an error message with optional error object and context.
   * 
   * @param {string} message - The error message to log
   * @param {Error} [error] - Optional error object with stack trace
   * @param {Record<string, any>} [context] - Optional additional context data
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorDetails = error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined;
      const fullContext = { ...context, error: errorDetails };
      console.error(this.formatMessage(LogLevel.ERROR, message, fullContext));
    }
  }
}

/**
 * Global logger instance used throughout the application.
 * 
 * This singleton instance provides a convenient way to access logging functionality
 * without needing to create and manage logger instances.
 * 
 * @constant {ConsoleLogger} logger
 * 
 * @example
 * ```typescript
 * import { logger } from '@core';
 * 
 * logger.info('Application started');
 * logger.error('Failed to connect', error);
 * ```
 */
export const logger = new ConsoleLogger();
