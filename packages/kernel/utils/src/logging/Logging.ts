import { LogLevel } from '@unitra/dict/logging';
import type { ILogger, ILogHandler, LogEntry } from '@unitra/types/logging';
import { TextLogFormatter } from './formatter/TextLogFormatter';
import { ConsoleLogHandler } from './handler/ConsoleLogHandler';

export class Logging {
  private static _level = LogLevel.WARN;
  private static handlers = new Set< ILogHandler >();

  static {
    this.addHandler( new ConsoleLogHandler( {}, new TextLogFormatter( {} ) ) );
  }

  private static write ( level: LogLevel, source: string, message: string, data?: unknown ) : void {
    if ( level < this._level ) return;

    const now = Date.now();
    const entry: LogEntry = {
      level, source, message, data, timestamp: now,
      isoTimestamp: new Date( now ).toISOString()
    };

    for ( const handler of this.handlers ) handler.write( entry );
  }

  public static get level () : LogLevel {
    return this._level;
  }

  public static set level ( level: LogLevel ) {
    this._level = level;
  }

  public static addHandler ( handler: ILogHandler ) : void {
    this.handlers.add( handler );
  }

  public static removeHandler ( handler: ILogHandler ) : void {
    this.handlers.delete( handler );
  }

  public static clearHandlers () : void {
    this.handlers.clear();
  }

  public static createSource ( source: string ) : ILogger {
    return {
      debug: ( message, data ) => this.debug( source, message, data ),
      log: ( message, data ) => this.log( source, message, data ),
      warn: ( message, data ) => this.warn( source, message, data ),
      error: ( message, data ) => this.error( source, message, data )
    };
  }

  public static debug ( source: string, message: string, data?: unknown ) : void {
    this.write( LogLevel.DEBUG, source, message, data );
  }

  public static log ( source: string, message: string, data?: unknown ) : void {
    this.write( LogLevel.LOG, source, message, data );
  }

  public static warn ( source: string, message: string, data?: unknown ) : void {
    this.write( LogLevel.WARN, source, message, data );
  }

  public static error ( source: string, message: string, data?: unknown ) : void {
    this.write( LogLevel.ERROR, source, message, data );
  }
}
