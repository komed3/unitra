import type { ILogHandler, LogEntry } from '@unitra/types/logging';
import { LogHandler } from './LogHandler';
import { LogLevel } from '@unitra/dict/logging';

export class ConsoleLogHandler extends LogHandler implements ILogHandler {
  private static readonly METHODS = {
    [ LogLevel.DEBUG ]: console.debug.bind( console ),
    [ LogLevel.LOG ]: console.log.bind( console ),
    [ LogLevel.WARN ]: console.warn.bind( console ),
    [ LogLevel.ERROR ]: console.error.bind( console ),
    [ LogLevel.NONE ]: () => undefined
  } as const;

  public override write ( entry: LogEntry ) : void {
    ConsoleLogHandler.METHODS[ entry.level ]( this.formatter.format( entry ) );
  }
}
