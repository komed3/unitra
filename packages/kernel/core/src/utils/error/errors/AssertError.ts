import { ErrorCode } from '@unitra/dict/utils';
import { UnitraError } from '../UnitraError';

export class AssertError extends UnitraError< ErrorCode.ASSERT_ERROR > {
  public override readonly code = ErrorCode.ASSERT_ERROR;
}
