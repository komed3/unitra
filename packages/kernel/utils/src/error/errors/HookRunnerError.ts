import { UnitraErrorCode } from '@unitra/dict/error';
import { HookRunnerError as ErrorType } from '@unitra/types/error';
import { UnitraError } from '../UnitraError';

export class HookRunnerError extends UnitraError< ErrorType > {
  public override readonly code = UnitraErrorCode.HOOK_RUNNER_ERROR;
}
