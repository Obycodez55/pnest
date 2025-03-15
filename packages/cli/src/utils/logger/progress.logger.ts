// src/utils/logger/progress.ts
import chalk from 'chalk';
import { SpinnerLogger } from './spinner.logger';
import { ProgressControl } from './logger.interfaces';

/**
 * Logger with progress bar capabilities
 */
export class ProgressLogger extends SpinnerLogger {
  /**
   * Create a progress bar
   * Note: For a real CLI, you might want to use a library like 'cli-progress'
   * This is a simplified version
   */
  progress(total: number, message: string = 'Progress'): ProgressControl {
    if (this.options.level < 3) { // INFO level
      // Return dummy object if logging is below the required level
      return {
        update: () => {},
        complete: () => {}
      };
    }

    let current = 0;
    const startTime = Date.now();
    const progressId = 'progress-' + startTime;
    const spinner = this.spinner(message);

    const drawProgress = (curr: number, msg?: string) => {
      const percentage = Math.min(Math.floor((curr / total) * 100), 100);
      const width = 30; // Width of the progress bar
      const completeSize = Math.floor((percentage / 100) * width);
      const completeStr = '█'.repeat(completeSize);
      const incompleteStr = '░'.repeat(width - completeSize);
      
      const progressBar = this.options.colors
        ? completeStr + chalk.gray(incompleteStr)
        : completeStr + incompleteStr;
        
      const formattedMsg = msg || message;
      spinner.update(`${formattedMsg} [${progressBar}] ${percentage}%`);
    };

    return {
      update: (curr: number, msg?: string) => {
        current = curr;
        drawProgress(current, msg);
      },
      complete: (msg?: string) => {
        drawProgress(total, msg || message);
        const duration = Date.now() - startTime;
        spinner.succeed(`${msg || message} ${this.options.colors ? chalk.green('completed') : 'completed'}${this.formatDuration(duration)}`);
      }
    };
  }
}