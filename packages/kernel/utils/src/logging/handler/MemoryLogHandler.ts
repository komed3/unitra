import type { ILogHandler, LogEntry } from '@unitra/types/logging';
import { LogHandler } from './LogHandler';

export class MemoryLogHandler extends LogHandler implements ILogHandler {
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

  public write ( entry: LogEntry ) {
    this.entries.push( entry );
  }

  public clear () : void {
    this.entries.length = 0;
  }
}
