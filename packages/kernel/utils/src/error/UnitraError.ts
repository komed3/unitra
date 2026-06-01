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
}
