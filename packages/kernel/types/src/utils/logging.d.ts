import type { LogLevel } from '@unitra/dict/utils';

export type LogEntry = {
  level: LogLevel;
  source: string;
  message: string;
  timestamp: number;
  isoTimestamp: string;
  data?: unknown;
};

export interface ILogFormatter< T extends object = {} > {
  readonly config: Readonly< T >;
  format: ( entry: LogEntry ) => string;
}

export interface ILogHandler< T extends object = {} > {
  readonly config: Readonly< T >;
  write: ( entry: LogEntry ) => void;
}

export interface ILogger {
  debug: ( message: string, data?: unknown ) => void;
  log: ( message: string, data?: unknown ) => void;
  warn: ( message: string, data?: unknown ) => void;
  error: ( message: string, data?: unknown ) => void;
}
