// src/utils/logger/spinner.ts
import ora, { Ora } from 'ora';
import { SpinnerControl, OperationInfo } from './logger.interfaces';
import { FormattingLogger } from './formatter.logger';

/**
 * Logger with spinner animation capabilities
 */
export class SpinnerLogger extends FormattingLogger {
  private activeSpinners: Map<string, OperationInfo> = new Map();

  /**
   * Create a spinner with the given message
   * @returns An object to control the spinner
   */
  spinner(message: string, id: string = 'default'): SpinnerControl {
    // Stop any existing spinner with the same ID
    if (this.activeSpinners.has(id)) {
      this.activeSpinners.get(id)?.spinner.stop();
    }

    // Start timer to track operation duration
    const startTime = Date.now();
    
    // Create and store the spinner
    const formattedMessage = this.format(message);
    
    const spinner = this.options.animations && this.options.level >= 3 // INFO level
      ? ora({ text: formattedMessage, color: 'blue' }).start()
      : { 
          text: formattedMessage,
          succeed: (text: string) => { console.log(text); },
          fail: (text: string) => { console.error(text); },
          warn: (text: string) => { console.warn(text); },
          info: (text: string) => { console.info(text); },
          stop: () => {},
          render: () => {},
        } as Ora;
        
    this.activeSpinners.set(id, { spinner, startTime });
    
    // If animations are disabled, just log the message
    if (!this.options.animations && this.options.level >= 3) { // INFO level
      console.log(formattedMessage);
    }

    return {
      succeed: (text?: string) => {
        const duration = this.getDuration(id);
        const successText = text 
          ? text + duration 
          : formattedMessage + duration;
          
        spinner.succeed(this.options.colors 
          ? successText
          : '✓ ' + successText);
        this.activeSpinners.delete(id);
      },
      fail: (text?: string) => {
        const duration = this.getDuration(id);
        const failText = text 
          ? text + duration 
          : formattedMessage + duration;
          
        spinner.fail(this.options.colors 
          ? failText
          : '✖ ' + failText);
        this.activeSpinners.delete(id);
      },
      warn: (text?: string) => {
        const duration = this.getDuration(id);
        const warnText = text 
          ? text + duration 
          : formattedMessage + duration;
          
        spinner.warn(this.options.colors 
          ? warnText
          : '⚠ ' + warnText);
        this.activeSpinners.delete(id);
      },
      info: (text?: string) => {
        const duration = this.getDuration(id);
        const infoText = text 
          ? text + duration 
          : formattedMessage + duration;
          
        spinner.info(this.options.colors 
          ? infoText
          : 'ℹ ' + infoText);
        this.activeSpinners.delete(id);
      },
      stop: () => {
        spinner.stop();
        this.activeSpinners.delete(id);
      },
      update: (text: string) => {
        const updatedText = this.format(text);
        spinner.text = updatedText;
        
        // If animations are disabled, log the update
        if (!this.options.animations && this.options.level >= 3) { // INFO level
          console.log(updatedText);
        }
      }
    };
  }

  /**
   * Calculate and format the duration since an operation started
   */
  private getDuration(id: string): string {
    const info = this.activeSpinners.get(id);
    if (!info) return '';
    
    const duration = Date.now() - info.startTime;
    return this.formatDuration(duration);
  }

  /**
   * Run a task with spinner indication
   * @param task The async task to run
   * @param message Message to display during task execution
   * @param id Optional spinner ID
   * @returns The result of the task
   */
  async task<T>(
    task: () => Promise<T>, 
    message: string, 
    id: string = 'default'
  ): Promise<T> {
    const spinner = this.spinner(message, id);
    
    try {
      const result = await task();
      spinner.succeed();
      return result;
    } catch (error) {
      spinner.fail(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}