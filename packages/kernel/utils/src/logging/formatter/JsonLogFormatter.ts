import type { LogEntry } from '@unitra/types/logging';
import { safeJsonStringify } from '../../helper';
import { LogFormatter } from './LogFormatter';

export class JsonLogFormatter extends LogFormatter< { space?: number } > {
  public format ( entry: LogEntry ) : string {
    return safeJsonStringify( entry, this.config.space );
  }
}
