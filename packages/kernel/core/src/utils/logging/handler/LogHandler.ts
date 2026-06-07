import type { ILogFormatter, ILogHandler, LogEntry } from '@unitra/types/utils/logging';

export abstract class LogHandler< T extends object = {} > implements ILogHandler< T > {
  constructor (
    public readonly config: Readonly< T >,
    protected readonly formatter?: ILogFormatter
  ) {}

  public abstract write ( entry: LogEntry ) : void;
}
