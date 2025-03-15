// packages/plugins/logger/src/index.ts
import { PNestPlugin } from '@pnest/cli/src/interfaces/plugin.interface';

// Export all the components for direct usage
export * from './logger.module';
export * from './logger.service';
export * from './interfaces';
export * from './constants';
export * from './providers/winston';
export * from './providers/pino';

class LoggerPlugin implements PNestPlugin {
  name = 'logger';
  version = '0.1.0';
  description = 'Logging plugin for NestJS applications';

  dependencies = {
    '@nestjs/common': '^9.0.0'
  };

  providers = ['winston', 'pino'];

  async setup(provider: string, options?: any): Promise<void> {
    // Add provider-specific dependencies
    switch (provider) {
      case 'winston':
        this.dependencies['winston'] = '^3.8.2';
        break;
      case 'pino':
        this.dependencies['pino'] = '^8.7.0';
        this.dependencies['pino-pretty'] = '^9.1.0';
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    // Setup would install dependencies and configure the application
    console.log(`Setting up logger plugin with provider: ${provider}`);
  }

  async cleanup(): Promise<void> {
    console.log('Cleaning up logger plugin');
  }

  getModuleImport(provider: string): string {
    switch (provider) {
      case 'winston':
        return `
import { LoggerModule } from '@pnest/plugin-logger';

// Add to imports array:
LoggerModule.forRoot({
  provider: 'winston',
  isGlobal: true,
  providerOptions: {
    level: 'info',
    transports: [
      // Add any custom transports here
    ]
  }
})`;
      case 'pino':
        return `
import { LoggerModule } from '@pnest/plugin-logger';

// Add to imports array:
LoggerModule.forRoot({
  provider: 'pino',
  isGlobal: true,
  providerOptions: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  }
})`;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}

export default LoggerPlugin;