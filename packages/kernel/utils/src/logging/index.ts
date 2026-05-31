import { Logging } from './Logging';
export default Logging;

export * from './formatter/LogFormatter';
export * from './handler/LogHandler';

export * from './formatter/JsonLogFormatter';
export * from './formatter/TextLogFormatter';

export * from './handler/ConsoleLogHandler';
export * from './handler/FileLogHandler';
export * from './handler/MemoryLogHandler';

export const debug = ( source: string, message: string, data?: unknown ) =>
  Logging.debug( source, message, data );

export const log = ( source: string, message: string, data?: unknown ) =>
  Logging.log( source, message, data );

export const warn = ( source: string, message: string, data?: unknown ) =>
  Logging.warn( source, message, data );

export const error = ( source: string, message: string, data?: unknown ) =>
  Logging.error( source, message, data );
