import { ErrorCode } from '@unitra/dict/utils';
import { UnitraError } from '../UnitraError';

export class ResolveError extends UnitraError< ErrorCode.RESOLVE_ERROR > {
  public override readonly code = ErrorCode.RESOLVE_ERROR;
}
