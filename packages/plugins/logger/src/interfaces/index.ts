export interface LoggerOptions {
  provider: 'winston' | 'pino';
  isGlobal?: boolean;
  providerOptions?: any;
}

export interface LoggerProvider {
  log(message: any, context?: string): void;
  error(message: any, trace?: string, context?: string): void;
  warn(message: any, context?: string): void;
  debug(message: any, context?: string): void;
  verbose(message: any, context?: string): void;
}


export interface LoggerPluginOptions {
  file?: {
    upload?:{
      provider: "local" | "s3" | "gcs";
      inteval?: number;
      maxSize?: number;
    }
  }
}