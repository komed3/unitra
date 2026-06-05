import { ErrorCode } from '@unitra/dict/utils';
import type { RegistryKey } from '@unitra/types/core/registry';
import { UnitraError } from '../UnitraError';

export class AssertError< K extends RegistryKey > extends UnitraError< ErrorCode.ASSERT_ERROR, K > {
  public override readonly code = ErrorCode.ASSERT_ERROR;
}
