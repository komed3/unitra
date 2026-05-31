import { LogLevel } from '@unitra/dict/logging';
import type { LogEntry } from '@unitra/types/logging';
import { LogHandler } from './LogHandler';

export class MemoryLogHandler extends LogHandler< { maxEntries?: number, minLevel?: LogLevel } > {
  public readonly entries: LogEntry[] = [];

  public get all () : LogEntry[] {
    return this.entries;
  }

  public get logs () : LogEntry[] {
    return this.entries.filter( entry => entry.level === 1 );
  }

  public get warnings () : LogEntry[] {
    return this.entries.filter( entry => entry.level === 2 );
  }

  public get errors () : LogEntry[] {
    return this.entries.filter( entry => entry.level === 3 );
  }

  public get size () : number {
    return this.entries.length;
  }

  public get errorCount () : number {
    return this.entries.reduce( ( acc, e ) => acc + ( e.level === LogLevel.ERROR ? 1 : 0 ), 0 );
  }

  public get warnCount () : number {
    return this.entries.reduce( ( acc, e ) => acc + ( e.level === LogLevel.WARN ? 1 : 0 ), 0 );
  }

  public write ( entry: LogEntry ) : void {
    if ( this.config.minLevel !== undefined && entry.level < this.config.minLevel ) return;

    this.entries.push( entry );
    const max = this.config.maxEntries;

    if ( max !== undefined && this.entries.length > max )
      this.entries.splice( 0, this.entries.length - max );
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
