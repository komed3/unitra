import { LogLevel } from '@unitra/dict/utils';
import type { LogEntry } from '@unitra/types/utils/logging';
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

    ( this.config.operation === 'append' ? appendFileSync : writeFileSync )( this.config.path,
      ( this.formatter?.format( entry ) ?? entry.message ) +
      ( this.config.newline ?? EOL )
    );
  }
}
