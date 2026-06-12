import { ErrorCode } from '@unitra/dict/utils';
import { UnitraError } from '../UnitraError';

export class RegistryError extends UnitraError< ErrorCode.REGISTRY_ERROR > {
  public override readonly code = ErrorCode.REGISTRY_ERROR;
}
