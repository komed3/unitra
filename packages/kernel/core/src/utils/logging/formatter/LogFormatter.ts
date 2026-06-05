import type { ILogFormatter, LogEntry } from '@unitra/types/utils/logging';

export abstract class LogFormatter< T extends object = {} > implements ILogFormatter< T > {
  constructor ( public readonly config: Readonly< T > ) {}

  public abstract format ( entry: LogEntry ) : string;
}
