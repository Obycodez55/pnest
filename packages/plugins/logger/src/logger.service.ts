// packages/plugins/logger/src/logger.service.ts
import { Inject, Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { LoggerOptions, LoggerProvider } from './interfaces';
import { LOGGER_OPTIONS } from './constants';
import { WinstonLoggerProvider } from './providers/winston';
import { PinoLoggerProvider } from './providers/pino';

@Injectable()
export class LoggerService implements NestLoggerService {
    private provider: LoggerProvider;
    private context?: string;

    constructor(@Inject(LOGGER_OPTIONS) private options: LoggerOptions) {
        this.setupProvider();
    }

    private setupProvider(): void {
        switch (this.options.provider) {
            case 'winston':
                this.provider = new WinstonLoggerProvider(this.options.providerOptions);
                break;
            case 'pino':
                this.provider = new PinoLoggerProvider(this.options.providerOptions);
                break;
            default:
                throw new Error(`Unsupported logger provider: ${this.options.provider}`);
        }
    }

    /**
     * Create a new logger instance with the specified context
     */
    createContextLogger(context: string): LoggerService {
        const logger = new LoggerService(this.options);
        logger.context = context;
        return logger;
    }

    /**
     * Set the context for the logger
     */
    setContext(context: string): void {
        this.context = context;
    }

    /**
     * Log a message at the 'log' level
     */
    log(message: any, context?: string): void {
        this.provider.log(message, context || this.context);
    }

    /**
     * Log a message at the 'error' level
     */
    error(message: any, trace?: string, context?: string): void {
        this.provider.error(message, trace, context || this.context);
    }

    /**
     * Log a message at the 'warn' level
     */
    warn(message: any, context?: string): void {
        this.provider.warn(message, context || this.context);
    }

    /**
     * Log a message at the 'debug' level
     */
    debug(message: any, context?: string): void {
        this.provider.debug(message, context || this.context);
    }

    /**
     * Log a message at the 'verbose' level
     */
    verbose(message: any, context?: string): void {
        this.provider.verbose(message, context || this.context);
    }
}