import { Logging } from './Logging';
export default Logging;

export { LogFormatter } from './formatter/LogFormatter';
export { LogHandler } from './handler/LogHandler';

export { JsonLogFormatter } from './formatter/JsonLogFormatter';
export { TextLogFormatter } from './formatter/TextLogFormatter';

export { ConsoleLogHandler } from './handler/ConsoleLogHandler';
export { FileLogHandler } from './handler/FileLogHandler';
export { MemoryLogHandler } from './handler/MemoryLogHandler';

export const debug = ( source: string, message: string, data?: unknown ) =>
  Logging.debug( source, message, data );

export const log = ( source: string, message: string, data?: unknown ) =>
  Logging.log( source, message, data );

export const warn = ( source: string, message: string, data?: unknown ) =>
  Logging.warn( source, message, data );

export const error = ( source: string, message: string, data?: unknown ) =>
  Logging.error( source, message, data );
