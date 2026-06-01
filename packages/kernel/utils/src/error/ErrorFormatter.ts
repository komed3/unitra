import type { ErrorFormatterConfig, SerializedError } from '@unitra/types/error';
import { serializeError } from './serializeError';

export class ErrorFormatter {
  private static readonly DEFAULT_CONFIG: Required< ErrorFormatterConfig > = {
    showCode: true, showData: true, showStack: true, showCauses: true, indent: '   '
  };

  private readonly options: Required< ErrorFormatterConfig >;
  private readonly serialized: SerializedError | unknown;

  constructor ( private readonly error: unknown, options?: ErrorFormatterConfig ) {
    this.options = { ...ErrorFormatter.DEFAULT_CONFIG, ...options };
    this.serialized = serializeError( error );
  }

  public format () : string {
    return '';
  }
}

export const formatError = ( error: unknown, options?: ErrorFormatterConfig ) =>
  new ErrorFormatter( error, options ).format();
