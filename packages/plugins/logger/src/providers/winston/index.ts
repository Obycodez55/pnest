import * as winston from 'winston';
import { LoggerProvider } from '../../interfaces';

export class WinstonLoggerProvider implements LoggerProvider {
    private logger: winston.Logger;

    constructor(options?: any) {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                winston.format.printf(info => {
                    const { timestamp, level, message, context, ms, ...meta } = info;
                    return `${timestamp} [${context || 'Application'}] ${level}: ${message} ${ms}${Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
                        }`;
                })
            ),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp(),
                        winston.format.ms(),
                        winston.format.printf(info => {
                            const { timestamp, level, message, context, ms, ...meta } = info;
                            return `${timestamp} [${context || 'Application'}] ${level}: ${message} ${ms}${Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
                                }`;
                        })
                    ),
                }),
            ],
            ...options,
        });
    }

    private formatMessage(message: any): string {
        return typeof message === 'object' ? JSON.stringify(message) : message;
    }

    log(message: any, context?: string): void {
        this.logger.info(this.formatMessage(message), { context });
    }

    error(message: any, trace?: string, context?: string): void {
        this.logger.error(this.formatMessage(message), {
            context,
            stack: trace
        });
    }

    warn(message: any, context?: string): void {
        this.logger.warn(this.formatMessage(message), { context });
    }

    debug(message: any, context?: string): void {
        this.logger.debug(this.formatMessage(message), { context });
    }

    verbose(message: any, context?: string): void {
        this.logger.verbose(this.formatMessage(message), { context });
    }
}