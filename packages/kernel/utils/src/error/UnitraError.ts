import type { UnitraErrorCode } from '@unitra/dict/unitra';
import type { ErrorFormatterConfig, SerializedError, UnitraErrorOptions } from '@unitra/types/error';
import Logging from '../logging';
import { formatError } from './ErrorFormatter';
import { serializeError } from './serializeError';

export class UnitraError extends Error {
  public readonly code?: UnitraErrorCode;
  public readonly data?: unknown;

  public override readonly cause?: unknown;

  public constructor ( message: string, options: UnitraErrorOptions = {} ) {
    super( message, { cause: options.cause } );

    this.name = this.constructor.name;

    this.code = options.code;
    this.data = options.data;
    this.cause = options.cause;
  }

  public get type () : string {
    return this.constructor.name;
  }

  public serialize () : SerializedError {
    return serializeError( this );
  }

  public format ( options?: ErrorFormatterConfig ) : string {
    return formatError( this, options );
  }

  public log () : void {
    Logging.error( this.code ?? this.name, this.message, this.data );
  }

  public static from ( error: unknown, options: UnitraErrorOptions = {} ) : UnitraError {
    if ( error instanceof UnitraError ) return error;

    if ( error instanceof Error ) return new UnitraError( error.message, {
      ...options, cause: error.cause ?? options.cause, data: {
        original: serializeError( error ), data: options.data
      }
    } );

    return new UnitraError( String( error ), options );
  }

  public static is ( value: unknown ) : value is UnitraError {
    return value instanceof UnitraError;
  }
}
