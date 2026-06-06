import { ErrorCode } from '@unitra/dict/utils';
import { UnitraError } from '../UnitraError';

export class SemverError extends UnitraError< ErrorCode.SEMVER_ERROR > {
  public override readonly code = ErrorCode.SEMVER_ERROR;
}
