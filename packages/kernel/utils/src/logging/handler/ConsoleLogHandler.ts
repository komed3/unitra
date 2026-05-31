import type { ILogHandler, LogEntry } from '@unitra/types/logging';
import { LogHandler } from './LogHandler';
import { LogLevel } from '@unitra/dict/logging';

export class ConsoleLogHandler extends LogHandler implements ILogHandler {
  private static readonly METHODS = {
    [ LogLevel.DEBUG ]: console.debug,
    [ LogLevel.LOG ]: console.log,
    [ LogLevel.WARN ]: console.warn,
    [ LogLevel.ERROR ]: console.error,
    [ LogLevel.NONE ]: () => undefined
  } as const;

  public override write ( entry: LogEntry ) : void {
    ConsoleLogHandler.METHODS[ entry.level ]( this.formatter.format( entry ) );
  }
}
