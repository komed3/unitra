import type { ErrorFormatterConfig, IUnitraError, SerializedError, UnitraErrorOptions } from '@unitra/types/utils/error';
import { formatError } from './ErrorFormatter';
import { serializeError } from './serializeError';

export class UnitraError< T extends IUnitraError = IUnitraError > extends Error implements IUnitraError {
  public readonly code?: T[ 'code' ];
  public readonly data?: T[ 'data' ];

  public override readonly cause?: unknown;

  public get summary () : string | undefined {
    return undefined;
  }

  public get type () : string {
    return this.constructor.name;
  }

  constructor ( message: string, options: UnitraErrorOptions< T[ 'data' ] > ) {
    super( message, { cause: options.cause } );

    this.name = this.constructor.name;
    this.data = options.data;
    this.cause = options.cause;
  }

  public serialize () : SerializedError {
    return serializeError( this );
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
