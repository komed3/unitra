import { UnitraErrorCode } from '@unitra/dict/error';
import type { SemverError as ErrorType } from '@unitra/types/error';
import { UnitraError } from '../UnitraError';

export class SemverError extends UnitraError< ErrorType > {
  public override readonly code = UnitraErrorCode.SEMVER_ERROR;
}
