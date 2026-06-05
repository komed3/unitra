import { ErrorCode } from '@unitra/dict/utils';
import type { RegistryKey } from '@unitra/types/core/registry';
import { UnitraError } from '../UnitraError';

export class ResolveError< K extends RegistryKey > extends UnitraError< ErrorCode.RESOLVE_ERROR, K > {
  public override readonly code = ErrorCode.RESOLVE_ERROR;
}
