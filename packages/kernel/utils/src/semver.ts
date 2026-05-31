import { ParsedSemverVersion, SemverVersion } from '@unitra/types/semver';

export class Semver {
  private static readonly OPERATORS = {
    '=': ( cmp: number ) => cmp === 0,
    '>': ( cmp: number ) => cmp > 0,
    '>=': ( cmp: number ) => cmp >= 0,
    '<': ( cmp: number ) => cmp < 0,
    '<=': ( cmp: number ) => cmp <= 0
  } as const;

  public static parse ( version: SemverVersion ) : ParsedSemverVersion {
    const [ semver, tag ] = version.split( '-', 2 );
    const parts = semver.split( '.' );

    if ( parts.length !== 3 )
      throw new Error( `Invalid semantic version "${ version }".` );

    const [ major, minor, patch ] = parts.map( Number );

    if ( Number.isNaN( major ) || Number.isNaN( minor ) || Number.isNaN( patch ) )
      throw new Error( `Invalid semantic version "${ version }".` );

    return [ major, minor, patch, tag ];
  }
}
