// src/utils/logger/base.ts
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import { LogLevel, LoggerOptions } from './logger.interfaces';

/**
 * Base Logger class with core logging functionality
 */
export class BaseLogger {
  protected options: LoggerOptions;

  /**
   * Create a new Logger instance
   * @param options Logger configuration options
   */
  constructor(options?: LoggerOptions) {
    this.options = {
      prefix: '[CLI]',
      level: LogLevel.INFO,
      animations: true,
      colors: true,
      timestamps: false,
      ...options
    };
  }

  /**
   * Format a message with the configured prefix and optional timestamp
   */
  protected format(message: string): string {
    let formatted = '';
    
    if (this.options.timestamps) {
      const timestamp = new Date().toISOString();
      formatted += this.options.colors 
        ? chalk.gray(`[${timestamp}] `)
        : `[${timestamp}] `;
    }
    
    if (this.options.prefix) {
      formatted += this.options.colors 
        ? chalk.blue(`${this.options.prefix} `)
        : `${this.options.prefix} `;
    }
    
    return formatted + message;
  }

  /**
   * Log a trace level message
   */
  trace(message: string, ...args: any[]): void {
    if (this.options.level >= LogLevel.TRACE) {
      console.trace(this.format(
        this.options.colors ? chalk.gray(message) : message
      ), ...args);
    }
  }

  /**
   * Log a debug level message
   */
  debug(message: string, ...args: any[]): void {
    if (this.options.level >= LogLevel.DEBUG) {
      console.debug(this.format(
        this.options.colors ? chalk.magenta(message) : message
      ), ...args);
    }
  }

  /**
   * Log an info level message
   */
  info(message: string, ...args: any[]): void {
    if (this.options.level >= LogLevel.INFO) {
      console.log(this.format(
        this.options.colors 
          ? logSymbols.info + ' ' + message
          : 'ℹ ' + message
      ), ...args);
    }
  }

  /**
   * Log a success message
   */
  success(message: string, ...args: any[]): void {
    if (this.options.level >= LogLevel.INFO) {
      console.log(this.format(
        this.options.colors 
          ? logSymbols.success + ' ' + chalk.green(message)
          : '✓ ' + message
      ), ...args);
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: any[]): void {
    if (this.options.level >= LogLevel.WARN) {
      console.warn(this.format(
        this.options.colors 
          ? logSymbols.warning + ' ' + chalk.yellow(message)
          : '⚠ ' + message
      ), ...args);
    }
  }

  /**
   * Log an error message
   */
  error(message: string, ...args: any[]): void {
    if (this.options.level >= LogLevel.ERROR) {
      console.error(this.format(
        this.options.colors 
          ? logSymbols.error + ' ' + chalk.red(message)
          : '✖ ' + message
      ), ...args);
    }
  }
}