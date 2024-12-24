import { ConsoleLogger, LoggerService } from '@nestjs/common';

/**
 * A logger service that outputs log messages in JSON format to the console.
 * Implements the LoggerService interface.
 */
export class JsonLogger extends ConsoleLogger implements LoggerService {
  /**
   * Logs a message with a specified level and optional context.
   *
   * @param level - The log level (e.g., 'info', 'error', 'debug').
   * @param message - The message to log. Can be of any type.
   * @param context - Optional. Additional context or metadata to include with the log message.
   */
  private logMessage(level: string, message: any, context?: string) {
    console.log(
      JSON.stringify({
        level,
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  /**
   * Logs a message with an optional context.
   *
   * @param message - The message to log. Can be of any type.
   * @param context - Optional. The context or source of the log message.
   */
  log(message: any, context?: string) {
    this.logMessage('log', message, context);
  }

  /**
   * Logs an error message with optional trace and context information.
   *
   * @param message - The error message to log. Can be of any type.
   * @param trace - Optional. A string representing the stack trace or additional trace information.
   * @param context - Optional. A string representing the context in which the error occurred.
   */
  error(message: any, trace?: string, context?: string) {
    this.logMessage('error', message, context);
    if (trace) {
      console.error(trace);
    }
  }

  /**
   * Logs a warning message with an optional context.
   *
   * @param message - The warning message to log. Can be of any type.
   * @param context - Optional. The context in which the warning occurred.
   */
  warn(message: any, context?: string) {
    this.logMessage('warn', message, context);
  }

  /**
   * Logs a debug message with optional context.
   *
   * @param message - The message to log. Can be of any type.
   * @param context - Optional. The context in which the message is logged.
   */
  debug(message: any, context?: string) {
    this.logMessage('debug', message, context);
  }

  /**
   * Logs a verbose level message to the console.
   *
   * @param message - The message to log. Can be of any type.
   * @param context - An optional string providing additional context about the message.
   */
  verbose(message: any, context?: string) {
    this.logMessage('verbose', message, context);
  }

  /**
   * Logs a message with a 'sequelize' level.
   *
   * @param {string} message - The message to log.
   */
  sequelizeLog(message: string) {
    this.logMessage('sequelize', message);
  }
}
