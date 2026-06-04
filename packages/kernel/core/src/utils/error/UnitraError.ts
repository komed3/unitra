import type { IUnitraError } from '@unitra/types/utils/error';

export class UnitraError< T extends IUnitraError = IUnitraError > extends Error implements IUnitraError {
  public readonly code?: T[ 'code' ];
  public readonly data?: T[ 'data' ];

  public override readonly cause?: unknown;

  public get summary () : string | undefined {
    return undefined;
  }
}
