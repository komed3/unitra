import type { ILogHandler, LogEntry } from '@unitra/types/logging';

export abstract class LogHandler implements ILogHandler {
  public abstract write ( entry: LogEntry ) : void;
}
