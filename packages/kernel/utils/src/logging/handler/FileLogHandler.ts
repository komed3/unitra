import { LogLevel } from '@unitra/dict/logging';
import type { LogEntry } from '@unitra/types/logging';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { EOL } from 'node:os';
import { dirname } from 'node:path';
import { LogHandler } from './LogHandler';

export type FileLogHandlerConfig = {
  path: string;
  operation: 'append' | 'overwrite';
  createDirectory?: boolean;
  newline?: string;
  minLevel?: LogLevel;
};

export class FileLogHandler extends LogHandler< FileLogHandlerConfig > {
  private initialized = false;

  private init () : void {
    if ( this.initialized ) return;

    if ( this.config.createDirectory )
      mkdirSync( dirname( this.config.path ), { recursive: true } );

    this.initialized = true;
  }

  public override write ( entry: LogEntry ) : void {
    if ( this.config.minLevel !== undefined && entry.level < this.config.minLevel ) return;
    this.init();

    const output =
      ( this.formatter?.format( entry ) ?? entry.message ) +
      ( this.config.newline ?? EOL );

    switch ( this.config.operation ) {
      case 'append':
        appendFileSync( this.config.path, output );
        break;
      case 'overwrite':
        writeFileSync( this.config.path, output );
        break;
    }
  }
}
