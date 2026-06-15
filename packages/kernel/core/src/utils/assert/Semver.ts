import type { SemverRange, SemverVersion } from '@unitra/types/utils/semver';
import { Semver } from '../Semver';
import { UnitraError } from '../error';

export class AssertSemver {
  public static is ( value: unknown ) : value is SemverVersion {
    return typeof value === 'string' && Semver.parse( value as SemverVersion ) !== undefined;
  }

  public static isRange ( value: unknown ) : value is SemverRange {
    return typeof value === 'string' && Semver.parseRange( value as SemverRange ) !== undefined;
  }

  public static assert ( value: unknown ) : asserts value is SemverVersion {
    if ( ! this.is( value ) ) throw UnitraError.from(
      new TypeError( `expected a valid semantic version` ),
      { context: { value } }
    );
  }

  public static assertRange ( value: unknown ) : asserts value is SemverRange {
    if ( ! this.is( value ) ) throw UnitraError.from(
      new TypeError( `expected a valid semantic version range` ),
      { context: { value } }
    );
  }
}
