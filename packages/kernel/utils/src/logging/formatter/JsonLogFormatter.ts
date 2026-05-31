import type { LogEntry } from '@unitra/types/logging';
import { safeJsonStringify } from '../../helper';
import { LogFormatter } from './LogFormatter';

export type JsonLogFormatterConfig = {
  space?: number;
};

export class JsonLogFormatter extends LogFormatter< JsonLogFormatterConfig > {
  public format ( entry: LogEntry ) : string {
    return safeJsonStringify( entry, this.config.space );
  }
}
