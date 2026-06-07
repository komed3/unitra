import type { LogEntry } from '@unitra/types/utils/logging';
import { safeJsonStringify } from '../../json';
import { LogFormatter } from './LogFormatter';

export type JsonLogFormatterConfig = {
  space?: number;
};

export class JsonLogFormatter extends LogFormatter< JsonLogFormatterConfig > {
  public override format ( entry: LogEntry ) : string {
    return safeJsonStringify( entry, this.config.space );
  }
}
