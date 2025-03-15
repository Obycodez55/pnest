// src/utils/logger/index.ts
import { ProgressLogger } from './progress.logger';
import { LoggerOptions, LogLevel } from './logger.interfaces';

/**
 * Complete Logger implementation with all features
 */
export class Logger extends ProgressLogger {
  // All functionality is inherited from parent classes
}

// Export all types and classes
export * from './logger.interfaces';
export * from './logger.base';
export * from './formatter.logger';
export * from './spinner.logger';
export * from './progress.logger';

// Export a default instance for direct use
export const logger = new Logger();

// Export utility to create group of related logs
export function createLogger(groupName: string, options?: LoggerOptions): Logger {
  return new Logger({
    prefix: `[${groupName}]`,
    ...options
  });
}