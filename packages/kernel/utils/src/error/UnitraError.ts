import type { UnitraErrorCode } from '@unitra/dict/unitra';
import type { UnitraErrorOptions } from '@unitra/types/error';

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

  public static from ( error: unknown, options: UnitraErrorOptions = {} ) : UnitraError {
    if ( error instanceof UnitraError ) return error;

    if ( error instanceof Error ) return new UnitraError( error.message, {
      ...options,
      cause: error.cause ?? options.cause,
      data: {
        ...(
          typeof options.data === 'object' && options.data !== null
            ? options.data as object : {}
        ),
        name: error.name,
        stack: error.stack
      }
    } );

    return new UnitraError( String( error ), options );
  }
}
