import type { ErrorFormatterConfig, SerializedError } from '@unitra/types/utils/error';
import { safeJsonStringify } from '../json';
import { serializeError } from './serializeError';

export class ErrorFormatter {
  private static readonly DEFAULT_CONFIG: Required< ErrorFormatterConfig > = {
    showCode: true, showSummary: true, showData: true,
    showStack: true, showCauses: true, indent: '   '
  };

  private readonly options: Required< ErrorFormatterConfig >;
  private readonly serialized: SerializedError;

  private formatHeader ( data: SerializedError ) : string {
    return this.options.showCode && data.code !== undefined
      ? `${ data.name } [${ data.code }]`
      : data.name;
  }

  private formatCauseTree ( data: SerializedError, prefix: string = '' ) : string[] {
    const lines = [
      `${ prefix }└─ ${ this.formatHeader( data ) }`,
      `${ prefix }${ this.options.indent }${ data.message }`
    ];

    if ( data.cause && typeof data.cause === 'object' )
      lines.push( ...this.formatCauseTree(
        data.cause as SerializedError,
        prefix + this.options.indent
      ) );

    return lines;
  }

  constructor ( error: unknown, options?: ErrorFormatterConfig ) {
    this.options = { ...ErrorFormatter.DEFAULT_CONFIG, ...options };

    const data = serializeError( error );
    this.serialized = typeof data !== 'object' || data === null
      ? { name: 'UnknownError', message: String( error ) }
      : data as SerializedError;
  }

  public format () : string {
    const { message, summary, data, cause, stack } = this.serialized;
    const lines: string[] = [ `${ this.formatHeader( this.serialized ) } :: ${ message }` ];

    if ( this.options.showSummary && summary )
      lines.push( '', summary );

    if ( this.options.showCauses && cause && typeof cause === 'object' )
      lines.push( '', 'Caused by:', ...this.formatCauseTree( cause as SerializedError ) );

    if ( this.options.showStack && stack )
      lines.push( '', 'Stack Trace:', stack );

    if ( this.options.showData && data !== undefined )
      lines.push( '', 'Data:', safeJsonStringify( data, 2 ) );

    return lines.join( '\n' );
  }
}

export const formatError = ( error: unknown, options?: ErrorFormatterConfig ) : string =>
  new ErrorFormatter( error, options ).format();
