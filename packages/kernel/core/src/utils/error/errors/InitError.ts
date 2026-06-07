import { ErrorCode } from '@unitra/dict/utils';
import { UnitraError } from '../UnitraError';

export class InitError extends UnitraError< ErrorCode.INIT_ERROR > {
  public override readonly code = ErrorCode.INIT_ERROR;
}
