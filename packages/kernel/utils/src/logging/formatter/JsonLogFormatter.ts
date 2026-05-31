import type { ILogFormatter, LogEntry } from '@unitra/types/logging';
import { LogFormatter } from './LogFormatter';

export class JsonLogFormatter extends LogFormatter implements ILogFormatter {
  constructor ( private _pretty: boolean = false ) {
    super();
  }

  public get pretty () : boolean {
    return this._pretty;
  }

  public set pretty ( is: boolean ) {
    this._pretty = is;
  }

  public format ( entry: LogEntry ) : string {
    return JSON.stringify( entry, null, this._pretty ? 2 : undefined );
  }
}
