import type { ErrorFormatterConfig, SerializedError } from '@unitra/types/error';
import { serializeError } from './serializeError';

export class ErrorFormatter {
  private static readonly DEFAULT_CONFIG: Required< ErrorFormatterConfig > = {
    showCode: true, showData: true, showStack: true, showCauses: true, indent: '   '
  };

  private readonly options: Required< ErrorFormatterConfig >;
  private readonly serialized: SerializedError | unknown;

  private formatHeader () : string {
    const data = this.serialized as SerializedError;
    return this.options.showCode && data.code !== undefined ? `${ data.name } [${ data.code }]` : data.name;
  }

  constructor ( private readonly error: unknown, options?: ErrorFormatterConfig ) {
    this.options = { ...ErrorFormatter.DEFAULT_CONFIG, ...options };
    this.serialized = serializeError( error );
  }

  public format () : string {
    if ( typeof this.serialized !== 'object' || this.serialized === null )
      return String( this.serialized );

    const data = this.serialized as SerializedError;
    const lines: string[] = [ this.formatHeader(), '', data.message ];

    return '';
  }
}

export const formatError = ( error: unknown, options?: ErrorFormatterConfig ) =>
  new ErrorFormatter( error, options ).format();
