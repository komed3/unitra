import type { LogEntry, LogHandler } from '@unitra/types/logging';

export class MemoryLogHandler {
  public readonly entries: LogEntry[] = [];

  public readonly handler: LogHandler = entry => {
    this.entries.push( entry );
  };

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

  public clear () : void {
    this.entries.length = 0;
  }
}
