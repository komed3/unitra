import { UnitraErrorCode } from '@unitra/dict/error';
import type { AssertRefError as ErrorType } from '@unitra/types/error';
import { UnitraError } from '../UnitraError';

export class AssertRefError extends UnitraError< ErrorType > {
  public override readonly code = UnitraErrorCode.ASSERT_REF_ERROR;
}
