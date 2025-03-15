import { DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LOGGER_OPTIONS } from './constants';
import { LoggerOptions } from './interfaces';

@Module({})
export class LoggerModule {
  /**
   * Register the logger module for root
   */
  static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: LoggerModule,
      global: options.isGlobal ?? true,
      providers: [
        {
          provide: LOGGER_OPTIONS,
          useValue: options,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }

  /**
   * Register the logger module for a specific context
   */
  static forFeature(context: string): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LoggerService,
          useFactory: (rootService: LoggerService) => {
            return rootService.createContextLogger(context);
          },
          inject: [LoggerService],
        },
      ],
      exports: [LoggerService],
    };
  }
}