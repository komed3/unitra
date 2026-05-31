import type { ILogFormatter, LogEntry } from '@unitra/types/logging';

export abstract class LogFormatter implements ILogFormatter {
  public abstract format ( entry: LogEntry ) : string;
}
