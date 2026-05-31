import { ParsedSemverRange, ParsedSemverVersion, SemverOperator, SemverRange, SemverVersion } from '@unitra/types/semver';

export class Semver {
  private static readonly OPMATCH = /^(\^|~|>=|<=|>|<|=)/;
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

  public static parseRange ( range: SemverRange ) : ParsedSemverRange {
    const match = range.match( this.OPMATCH );
    const operator = ( match?.[ 1 ] ?? '=' ) as SemverOperator;
    const version = ( operator === '=' ? range : range.slice( operator.length ) ) as SemverVersion;

    return { operator, version: this.parse( version ) };
  }
}
