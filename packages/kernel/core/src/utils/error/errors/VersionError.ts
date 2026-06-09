import { ErrorCode } from '@unitra/dict/utils';
import { UnitraError } from '../UnitraError';

export class VersionError extends UnitraError< ErrorCode.VERSION_ERROR > {
  public override readonly code = ErrorCode.VERSION_ERROR;
}
