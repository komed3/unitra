import { LogLevel } from '@unitra/dict/logging';
import type { LogEntry, Logger, LogHandler } from '@unitra/types/logging';

export class Logging {
  private static _level = LogLevel.WARN;
  private static handlers = new Set< LogHandler >();

  private static write ( level: LogLevel, source: string, message: string, data?: unknown ) : void {
    if ( level < this.level ) return;

    const entry: LogEntry = { level, source, message, timestamp: Date.now(), data };
    for ( const handler of this.handlers ) handler( entry );
  }

  public static get level () : LogLevel {
    return this._level;
  }

  public static set level ( level: LogLevel ) {
    this._level = level;
  }

  public static addHandler ( handler: LogHandler ) : void {
    this.handlers.add( handler );
  }

  public static removeHandler ( handler: LogHandler ) : void {
    this.handlers.delete( handler );
  }

  public static clearHandlers () : void {
    this.handlers.clear();
  }

  public static createSource ( source: string ) : Logger {
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
