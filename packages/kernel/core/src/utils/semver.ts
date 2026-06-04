import type { ParsedSemverVersion, SemverVersion } from '@unitra/types/utils/semver';
import { SemverError } from './error';

export class Semver {
  private static readonly OPMATCH = /^(\^|~|>=|<=|>|<|=)/;

  private static readonly OPERATORS = {
    '=': ( cmp: number ) => cmp === 0,
    '>': ( cmp: number ) => cmp > 0,
    '>=': ( cmp: number ) => cmp >= 0,
    '<': ( cmp: number ) => cmp < 0,
    '<=': ( cmp: number ) => cmp <= 0
  } as const;

  private static satisfiesTilde ( version: ParsedSemverVersion, range: ParsedSemverVersion, cmp: number ) : boolean {
    return cmp >= 0 && version[ 0 ] === range[ 0 ] && version[ 1 ] === range[ 1 ];
  }

  private static satisfiesCaret ( version: ParsedSemverVersion, range: ParsedSemverVersion, cmp: number ) : boolean {
    return cmp >= 0 && (
      ( range[ 0 ] > 0 && version[ 0 ] === range[ 0 ] ) ||
      ( range[ 1 ] > 0 && version[ 0 ] === 0 && version[ 1 ] === range[ 1 ] ) ||
      ( version[ 0 ] === 0 && version[ 1 ] === 0 && version[ 2 ] === range[ 2 ] )
    );
  }

  public static parse ( version: SemverVersion ) : ParsedSemverVersion {
    const [ semver, tag ] = version.split( '-', 2 );
    const parts = semver.split( '.' );

    if ( parts.length !== 3 )
      throw new SemverError(
        `invalid semantic version "${ version }"`,
        { data: { version, semver, tag, parts } }
      );

    const [ major, minor, patch ] = parts.map( Number );

    if ( Number.isNaN( major ) || Number.isNaN( minor ) || Number.isNaN( patch ) )
      throw new SemverError(
        `invalid semantic version "${ version }"`,
        { data: { version, semver, tag, parts } }
      );

    return [ major, minor, patch, tag ];
  }
}
