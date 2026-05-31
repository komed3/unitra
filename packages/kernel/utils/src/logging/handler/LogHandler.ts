import type { ILogFormatter, ILogHandler, LogEntry } from '@unitra/types/logging';

export abstract class LogHandler< T extends object = {} > implements ILogHandler< T > {
  constructor (
    protected readonly formatter?: ILogFormatter,
    public readonly config: Readonly< T > = Object.create( null )
  ) {}

  public abstract write ( entry: LogEntry ) : void;
}
