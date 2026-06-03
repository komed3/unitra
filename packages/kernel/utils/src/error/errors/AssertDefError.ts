import { UnitraErrorCode } from '@unitra/dict/error';
import type { AssertDefError as ErrorType } from '@unitra/types/error';
import { UnitraError } from '../UnitraError';

export class AssertDefError extends UnitraError< ErrorType > {
  public override readonly code = UnitraErrorCode.ASSERT_DEF_ERROR;
}
