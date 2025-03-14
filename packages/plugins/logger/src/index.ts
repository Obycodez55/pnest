// packages/plugins/logger/src/index.ts
import { PNestPlugin } from '../../../cli/src/interfaces/plugin.interface';

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
        this.dependencies['nest-winston'] = '^1.8.0';
        break;
      case 'pino':
        this.dependencies['pino'] = '^8.7.0';
        this.dependencies['nestjs-pino'] = '^3.1.2';
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
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

// Add to imports array:
WinstonModule.forRoot({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.colorize(),
        winston.format.printf(info => \`[NestJS] \${info.timestamp} \${info.level}: \${info.message}\`)
      )
    })
  ]
})`;
      case 'pino':
        return `
import { LoggerModule } from 'nestjs-pino';

// Add to imports array:
LoggerModule.forRoot({
  pinoHttp: {
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