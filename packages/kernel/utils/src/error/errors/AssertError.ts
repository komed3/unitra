import { UnitraErrorCode } from '@unitra/dict/error';
import type { AssertError as ErrorType } from '@unitra/types/error';
import { UnitraError } from '../UnitraError';

export class AssertError extends UnitraError< ErrorType > {
  public override readonly code = UnitraErrorCode.ASSERT_ERROR;
}
