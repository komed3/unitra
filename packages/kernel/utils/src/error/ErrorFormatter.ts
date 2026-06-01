import type { ErrorFormatterConfig, SerializedError } from '@unitra/types/error';
import { safeJsonStringify } from '../helper';
import { serializeError } from './serializeError';

export class ErrorFormatter {
  private static readonly DEFAULT_CONFIG: Required< ErrorFormatterConfig > = {
    showCode: true, showData: true, showStack: true, showCauses: true, indent: '   '
  };

  private readonly options: Required< ErrorFormatterConfig >;
  private readonly serialized: SerializedError | unknown;

  private formatHeader ( data: SerializedError ) : string {
    return this.options.showCode && data.code !== undefined ? `${ data.name } [${ data.code }]` : data.name;
  }

  private formatCauseTree ( data: SerializedError, _prefix: string = '' ) : string[] {
    const lines = [
      `${ _prefix }└─ ${ this.formatHeader( data ) }`,
      `${ _prefix }${ this.options.indent }${ data.message }`
    ];

    if ( data.cause && typeof data.cause === 'object' )
      lines.push( ...this.formatCauseTree(
        data.cause as SerializedError,
        _prefix + this.options.indent
      ) );

    return lines;
  }

  constructor ( private readonly error: unknown, options?: ErrorFormatterConfig ) {
    this.options = { ...ErrorFormatter.DEFAULT_CONFIG, ...options };
    this.serialized = serializeError( error );
  }

  public format () : string {
    if ( typeof this.serialized !== 'object' || this.serialized === null )
      return String( this.serialized );

    const data = this.serialized as SerializedError;
    const lines: string[] = [ this.formatHeader( data ), '', data.message ];

    if ( this.options.showData && data.data !== undefined )
      lines.push( '', 'Data:', safeJsonStringify( data.data, 2 ) );

    if ( this.options.showCauses && data.cause && typeof data.cause === 'object' )
      lines.push( '', 'Caused by:', ...this.formatCauseTree( data.cause as SerializedError ) );

    if ( this.options.showStack && data.stack )
      lines.push( '', 'Stack Trace:', data.stack );

    return lines.join( '\n' );
  }
}

export const formatError = ( error: unknown, options?: ErrorFormatterConfig ) =>
  new ErrorFormatter( error, options ).format();
