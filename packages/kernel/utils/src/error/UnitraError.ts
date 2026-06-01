import type { UnitraErrorCode } from '@unitra/dict/error';
import type { ErrorFormatterConfig, IUnitraError, SerializedError, UnitraErrorOptions } from '@unitra/types/error';
import Logging from '../logging';
import { formatError } from './ErrorFormatter';
import { serializeError } from './serializeError';

export class UnitraError extends Error implements IUnitraError {
  public readonly code?: UnitraErrorCode;
  public readonly data?: unknown;

  public override readonly cause?: unknown;

  constructor ( message: string, options: UnitraErrorOptions = {} ) {
    super( message, { cause: options.cause } );

    this.name = this.constructor.name;
    this.data = options.data;
    this.cause = options.cause;
  }

  public get type () : string {
    return this.constructor.name;
  }

  public override toString () : string {
    return this.format();
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
