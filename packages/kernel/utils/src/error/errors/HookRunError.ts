import { UnitraErrorCode } from '@unitra/dict/error';
import type { HookRunError as ErrorType } from '@unitra/types/error';
import type { HookId } from '@unitra/types/hook';
import { UnitraError } from '../UnitraError';

export class HookRunError< K extends HookId > extends UnitraError< ErrorType< K > > {
  public override readonly code = UnitraErrorCode.HOOK_RUN_ERROR;
}
