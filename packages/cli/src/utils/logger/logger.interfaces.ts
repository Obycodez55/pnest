// src/utils/logger/types.ts
import { Ora } from 'ora';

/**
 * Log levels
 */
export enum LogLevel {
  SILENT = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
  TRACE = 5
}

/**
 * Logger configuration options
 */
export interface LoggerOptions {
  /** Prefix for all log messages */
  prefix?: string;
  /** Minimum log level to display */
  level?: LogLevel;
  /** Whether to enable animated spinners */
  animations?: boolean;
  /** Whether to use colors in output */
  colors?: boolean;
  /** Whether to include timestamps in log messages */
  timestamps?: boolean;
}

/**
 * Interface for spinner control object
 */
export interface SpinnerControl {
  succeed: (text?: string) => void;
  fail: (text?: string) => void;
  warn: (text?: string) => void;
  info: (text?: string) => void;
  stop: () => void;
  update: (text: string) => void;
}

/**
 * Interface for progress bar control
 */
export interface ProgressControl {
  update: (current: number, message?: string) => void;
  complete: (message?: string) => void;
}

// Store information about active operations
export interface OperationInfo {
  spinner: Ora;
  startTime: number;
}