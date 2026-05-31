import type { ILogFormatter, LogEntry } from '@unitra/types/logging';

export abstract class LogFormatter< T extends object = {} > implements ILogFormatter< T > {
  constructor ( public readonly config: Readonly< T > = Object.create( null ) ) {}
  public abstract format ( entry: LogEntry ) : string;
}
