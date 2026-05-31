import type { ILogFormatter, ILogHandler, LogEntry } from '@unitra/types/logging';
import { TextLogFormatter } from '../formatter/TextLogFormatter';

export abstract class LogHandler implements ILogHandler {
  constructor ( protected readonly formatter: ILogFormatter = new TextLogFormatter( {} ) ) {}

  public abstract write ( entry: LogEntry ) : void;
}
