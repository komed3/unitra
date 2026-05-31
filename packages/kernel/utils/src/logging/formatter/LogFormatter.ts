import type { ILogFormatter, LogEntry } from '@unitra/types/logging';

export abstract class LogFormatter< T extends object = {} > implements ILogFormatter< T > {
  constructor ( public readonly config: T ) {}
  public abstract format ( entry: LogEntry ) : string;
}
