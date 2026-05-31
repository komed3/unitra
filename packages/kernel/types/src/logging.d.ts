import type { LogLevel } from '@unitra/dict/logging';

export type LogEntry = {
  level: LogLevel;
  source: string;
  message: string;
  timestamp: number;
  data?: unknown;
};

export type LogHandler = ( entry: LogEntry ) => void;

export interface Logger {
  debug: ( message: string, data?: unknown ) => void;
  log: ( message: string, data?: unknown ) => void;
  warn: ( message: string, data?: unknown ) => void;
  error: ( message: string, data?: unknown ) => void;
}
