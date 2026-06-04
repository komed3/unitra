import { ErrorCode } from '@unitra/dict/utils';
import type { SemverVersion } from '@unitra/types/utils/semver';
import { UnitraError } from '../UnitraError';

export type SemverErrorData = {
  version: SemverVersion;
  semver: string;
  tag: string;
  parts: string[];
};

export class SemverError extends UnitraError< ErrorCode.SEMVER_ERROR, SemverErrorData > {
  public override readonly code = ErrorCode.SEMVER_ERROR;
}
