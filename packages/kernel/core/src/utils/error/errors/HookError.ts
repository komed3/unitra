import { ErrorCode } from '@unitra/dict/utils';
import { UnitraError } from '../UnitraError';

export class HookError extends UnitraError< ErrorCode.HOOK_ERROR > {
  public override readonly code = ErrorCode.HOOK_ERROR;
}
