import type { IUnitraError, UnitraErrorOptions } from '@unitra/types/utils/error';

export class UnitraError< T extends IUnitraError = IUnitraError > extends Error implements IUnitraError {
  public readonly code?: T[ 'code' ];
  public readonly data?: T[ 'data' ];

  public override readonly cause?: unknown;

  public get summary () : string | undefined {
    return undefined;
  }

  constructor ( message: string, options: UnitraErrorOptions< T[ 'data' ] > ) {
    super( message, { cause: options.cause } );

    this.name = this.constructor.name;
    this.cause = options.cause;

    if ( 'data' in options ) this.data = options.data;
  }
}
