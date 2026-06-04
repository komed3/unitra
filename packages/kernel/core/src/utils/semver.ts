import type { ParsedSemverVersion } from '@unitra/types/utils/semver';

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
}
