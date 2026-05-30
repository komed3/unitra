import type { ParsedSemverVersion, PluginResolveResult, SemverOperator, SemverRange, SemverVersion } from '@unitra/types/plugin';
import { PluginRegistry } from './PluginRegistry';

export class PluginResolver {
  private static parse ( version: SemverVersion ) : ParsedSemverVersion {
    const [ semver, tag ] = version.split( '-' );
    const [ major, minor, patch ] = semver.split( '.' ).map( Number );

    return { major, minor, patch, tag };
  }

  private static compare ( a: ParsedSemverVersion, b: ParsedSemverVersion ) : number {
    if ( a.major !== b.major ) return a.major - b.major;
    if ( a.minor !== b.minor ) return a.minor - b.minor;
    return a.patch - b.patch;
  }

  private static satisfies ( version: SemverVersion, range: SemverRange ) : boolean {
    const match = range.match( /^(^|~|>=|<=|>|<|=)/ );
    const op = ( match?.[ 1 ] ?? '=' ) as SemverOperator;
    const raw = ( op === '=' ? range : range.slice( op.length ) ) as SemverVersion;

    const v = this.parse( version );
    const r = this.parse( raw );
    const cmp = this.compare( v, r );

    switch ( op ) {
      case '=':
        return cmp === 0;
      case '>':
        return cmp > 0;
      case '>=':
        return cmp >= 0;
      case '<':
        return cmp < 0;
      case '<=':
        return cmp <= 0;
      case '~':
        return (
          v.major === r.major &&
          v.minor === r.minor &&
          cmp >= 0
        );
      case '^':
        return (
          r.major > 0 &&
          v.major === r.major &&
          cmp >= 0
        ) || (
          r.major === 0 &&
          r.minor > 0 &&
          v.major === 0 &&
          v.minor === r.minor &&
          cmp >= 0
        ) || (
          v.major === 0 &&
          v.minor === 0 &&
          v.patch === r.patch
        );
    }
  }

  public static resolve () : PluginResolveResult {
    const catalog = PluginRegistry.catalog;
  }
}

export const resolvePlugins = () => PluginResolver.resolve();
