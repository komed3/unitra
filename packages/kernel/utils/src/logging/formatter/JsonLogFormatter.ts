import type { ILogFormatter, LogEntry } from '@unitra/types/logging';
import { LogFormatter } from './LogFormatter';

export class JsonLogFormatter extends LogFormatter implements ILogFormatter {
  public format ( entry: LogEntry ) : string {
    return JSON.stringify( entry );
  }
}
