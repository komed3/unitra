import type { ILogFormatter, LogEntry } from '@unitra/types/logging';
import { safeJsonStringify } from '../../helper';
import { LogFormatter } from './LogFormatter';

export class JsonLogFormatter extends LogFormatter implements ILogFormatter {
  public format ( entry: LogEntry ) : string {
    return safeJsonStringify( entry );
  }
}
