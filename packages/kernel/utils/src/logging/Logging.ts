import { LogLevel } from '@unitra/dict/logging';
import type { LogHandler } from '@unitra/types/logging';

export class Logging {
  private static level = LogLevel.LOG;
  private static handlers = new Set< LogHandler >();
}
