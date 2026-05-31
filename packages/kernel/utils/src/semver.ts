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

  public static compare ( a: ParsedSemverVersion, b: ParsedSemverVersion ) : number {
    if ( a[ 0 ] !== b[ 0 ] ) return a[ 0 ] - b[ 0 ];
    if ( a[ 1 ] !== b[ 1 ] ) return a[ 1 ] - b[ 1 ];
    return a[ 2 ] - b[ 2 ];
  }

  public static compareVersions ( a: SemverVersion, b: SemverVersion ) : number {
    return this.compare( this.parse( a ), this.parse( b ) );
  }

  public static satisfies ( version: SemverVersion, range: SemverRange ) : boolean {
    return this.satisfiesParsed( this.parse( version ), this.parseRange( range ) );
  }

  public static satisfiesParsed ( version: ParsedSemverVersion, range: ParsedSemverRange ) : boolean {
    const cmp = this.compare( version, range.version );

    switch ( range.operator ) {
      case '~':
        return this.satisfiesTilde( version, range.version, cmp );
      case '^':
        return this.satisfiesCaret( version, range.version, cmp );
      default:
        return this.OPERATORS[ range.operator ]( cmp );
    }
  }
}
