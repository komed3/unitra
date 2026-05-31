import { LogLevel } from '@unitra/dict/logging';
import type { ILogFormatter, LogEntry } from '@unitra/types/logging';
import { LogFormatter } from './LogFormatter';

export class TextLogFormatter extends LogFormatter implements ILogFormatter {
  public format ( entry: LogEntry ) : string {
    let output = `[${ entry.isoTimestamp }] [${ LogLevel[ entry.level ] }] [${ entry.source }] ${ entry.message }`;
    if ( entry.data !== undefined ) output += '\n' + JSON.stringify( entry.data, null, 2 );
    return output;
  }
}
