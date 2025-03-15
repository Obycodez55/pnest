// packages/plugins/logger/src/providers/pino.provider.ts
import pino from 'pino';
import { LoggerProvider } from '../../interfaces';

export class PinoLoggerProvider implements LoggerProvider {
  private logger: pino.Logger;

  constructor(options?: any) {
    this.logger = pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: true,
        },
      },
      ...options,
    });
  }

  private formatMessage(message: any): string {
    return typeof message === 'object' ? JSON.stringify(message) : message;
  }

  private formatContext(context?: string): object {
    return context ? { context } : {};
  }

  log(message: any, context?: string): void {
    this.logger.info(this.formatContext(context), this.formatMessage(message));
  }

  error(message: any, trace?: string, context?: string): void {
    this.logger.error(
      { ...this.formatContext(context), stack: trace },
      this.formatMessage(message)
    );
  }

  warn(message: any, context?: string): void {
    this.logger.warn(this.formatContext(context), this.formatMessage(message));
  }

  debug(message: any, context?: string): void {
    this.logger.debug(this.formatContext(context), this.formatMessage(message));
  }

  verbose(message: any, context?: string): void {
    this.logger.trace(this.formatContext(context), this.formatMessage(message));
  }
}