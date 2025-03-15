// src/utils/logger/formatting.ts
import chalk from 'chalk';
import figures from 'figures';
import { BaseLogger } from './logger.base';

/**
 * Logger methods for formatted output like sections and lists
 */
export class FormattingLogger extends BaseLogger {
  /**
   * Log a section header
   */
  section(title: string): void {
    if (this.options.level >= 3) { // INFO level
      console.log('');
      console.log(this.format(
        this.options.colors 
          ? chalk.bold.underline(title)
          : title.toUpperCase()
      ));
      console.log('');
    }
  }

  /**
   * Log a list item with a bullet point
   */
  listItem(message: string, indent: number = 1): void {
    if (this.options.level >= 3) { // INFO level
      const indentation = '  '.repeat(indent);
      console.log(indentation + (
        this.options.colors 
          ? chalk.cyan(figures.bullet) + ' ' + message
          : '• ' + message
      ));
    }
  }

  /**
   * Log a command example
   */
  example(command: string, description?: string): void {
    if (this.options.level >= 3) { // INFO level
      const formattedCommand = this.options.colors 
        ? chalk.bold(command)
        : command;
        
      if (description) {
        console.log(`  $ ${formattedCommand} - ${description}`);
      } else {
        console.log(`  $ ${formattedCommand}`);
      }
    }
  }

  /**
   * Format the duration since an operation started
   */
  protected formatDuration(duration: number): string {
    return this.options.colors
      ? chalk.gray(` (${duration}ms)`)
      : ` (${duration}ms)`;
  }
}