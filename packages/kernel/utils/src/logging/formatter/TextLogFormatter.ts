import { LogLevel } from '@unitra/dict/logging';
import type { ILogFormatter, LogEntry } from '@unitra/types/logging';
import { safeJsonStringify } from '../../helper';
import { LogFormatter } from './LogFormatter';

export class TextLogFormatter extends LogFormatter implements ILogFormatter {
  public format ( entry: LogEntry ) : string {
    let output = `[${ entry.isoTimestamp }] [${ LogLevel[ entry.level ] }] [${ entry.source }] ${ entry.message }`;
    if ( entry.data !== undefined ) output += '\n' + safeJsonStringify( entry.data );
    return output;
  }
}
