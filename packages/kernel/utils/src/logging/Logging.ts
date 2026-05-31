import { LogLevel } from '@unitra/dict/logging';
import type { LogHandler } from '@unitra/types/logging';

export class Logging {
  private static _level = LogLevel.WARN;
  private static handlers = new Set< LogHandler >();

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
}
