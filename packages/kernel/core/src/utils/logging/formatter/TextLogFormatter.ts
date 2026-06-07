import { LogLevel } from '@unitra/dict/utils';
import type { LogEntry } from '@unitra/types/utils/logging';
import { safeJsonStringify } from '../../json';
import { LogFormatter } from './LogFormatter';

export type TextLogFormatterConfig = {
  showData?: boolean;
};

export class TextLogFormatter extends LogFormatter< TextLogFormatterConfig > {
  public format ( entry: LogEntry ) : string {
    const out: string[] = [
      `[${ entry.isoTimestamp }]`,
      `[${ LogLevel[ entry.level ] }]`,
      `[${ entry.source }]`,
      entry.message
    ];

    if ( this.config.showData !== false && entry.data !== undefined )
      out.push( safeJsonStringify( entry.data ) );

    return out.join( ' ' );
  }
}
