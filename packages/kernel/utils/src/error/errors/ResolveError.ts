import { UnitraErrorCode } from '@unitra/dict/error';
import type { ResolveError as ErrorType } from '@unitra/types/error';
import type { RegistryKey } from '@unitra/types/registry';
import { UnitraError } from '../UnitraError';

export class ResolveError< K extends RegistryKey > extends UnitraError< ErrorType< K > > {
  public override readonly code = UnitraErrorCode.RESOLVE_ERROR;
}
