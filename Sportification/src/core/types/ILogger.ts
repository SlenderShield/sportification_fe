/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Log entry structure
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
}

/**
 * Logger interface
 */
export interface ILogger {
  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, any>): void;

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>): void;

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, any>): void;

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: Record<string, any>): void;

  /**
   * Set minimum log level
   */
  setLevel(level: LogLevel): void;
}

/**
 * Simple console logger implementation
 */
export class ConsoleLogger implements ILogger {
  private level: LogLevel = LogLevel.DEBUG;

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message, context));
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context));
    }
  }

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

// Global logger instance
export const logger = new ConsoleLogger();
