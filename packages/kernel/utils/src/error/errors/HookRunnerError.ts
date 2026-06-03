import { UnitraErrorCode } from '@unitra/dict/error';
import type { HookRunnerError as ErrorType } from '@unitra/types/error';
import type { HookId } from '@unitra/types/hook';
import { UnitraError } from '../UnitraError';

export class HookRunnerError< K extends HookId > extends UnitraError< ErrorType< K > > {
  public override readonly code = UnitraErrorCode.HOOK_RUNNER_ERROR;
}
