import { LogLevel } from '@unitra/dict/utils';
import type { LogEntry } from '@unitra/types/utils/logging';
import { LogHandler } from './LogHandler';

export type MemoryLogHandlerConfig = {
  maxEntries?: number;
  minLevel?: LogLevel;
};

export class MemoryLogHandler extends LogHandler< MemoryLogHandlerConfig > {
  private readonly entries: LogEntry[] = [];

  public get size () : number {
    return this.entries.length;
  }

  public get errorCount () : number {
    return this.entries.reduce( ( acc, e ) => acc + +( e.level === LogLevel.ERROR ), 0 );
  }

  public get warnCount () : number {
    return this.entries.reduce( ( acc, e ) => acc + +( e.level === LogLevel.WARN ), 0 );
  }

  public write ( entry: LogEntry ) : void {
    if ( this.config.minLevel !== undefined && entry.level < this.config.minLevel ) return;

    this.entries.push( entry );
    const max = this.config.maxEntries;

    if ( max !== undefined && this.entries.length > max )
      this.entries.splice( 0, this.entries.length - max );
  }

  public all () : LogEntry[] {
    return this.entries;
  }

  public logs () : LogEntry[] {
    return this.entries.filter( entry => entry.level === 1 );
  }

  public warnings () : LogEntry[] {
    return this.entries.filter( entry => entry.level === 2 );
  }

  public errors () : LogEntry[] {
    return this.entries.filter( entry => entry.level === 3 );
  }

  public snapshot () : LogEntry[] {
    return [ ...this.entries ];
  }

  public clear () : void {
    this.entries.length = 0;
  }

  public flush () : LogEntry[] {
    const copy = [ ...this.entries ];
    this.clear();

    return copy;
  }
}
