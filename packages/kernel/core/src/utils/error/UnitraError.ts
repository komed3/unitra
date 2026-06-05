import type { ErrorCode } from '@unitra/dict/utils';
import type { ErrorContext, ErrorFormatterConfig, IUnitraError, SerializedError, UnitraErrorOptions } from '@unitra/types/utils/error';
import { Logging } from '../logging';
import { formatError } from './ErrorFormatter';
import { serializeError } from './serializeError';

export class UnitraError< C extends ErrorCode = ErrorCode > extends Error implements IUnitraError< C > {
  public override readonly cause?: unknown;
  public readonly code?: C;
  public readonly context?: ErrorContext< C >;

  public get summary () : string | undefined {
    return undefined;
  }

  public get type () : string {
    return this.constructor.name;
  }

  constructor ( message: string, options: UnitraErrorOptions< C > ) {
    super( message, { cause: options.cause } );
    this.name = this.constructor.name;

    if ( 'context' in options ) this.context = options.context;
  }

  public serialize () : SerializedError {
    return serializeError( this );
  }

  public log () : void {
    Logging.error( this.code ?? this.name, this.message, this.context );
  }

  public format ( options?: ErrorFormatterConfig ) : string {
    return formatError( this, options );
  }

  public override toString () : string {
    return this.format();
  }

  public static from ( error: unknown, options: UnitraErrorOptions ) : UnitraError {
    if ( error instanceof UnitraError ) return error;

    if ( error instanceof Error ) {
      const res = new UnitraError( error.message, { ...options, cause: error } );
      res.stack = error.stack;

      return res;
    }

    return new UnitraError( String( error ), options );
  }

  public static is ( value: unknown ) : value is UnitraError {
    return value instanceof UnitraError;
  }
}
