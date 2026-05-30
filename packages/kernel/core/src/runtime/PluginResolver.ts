import type { ParsedSemverVersion, PluginDefinition, SemverOperator } from '@unitra/types/plugin';
import { PluginLoader } from './PluginLoader';

type Selection = Map< string, PluginDefinition >;

export class PluginResolver {
  private static parse ( version: string ) : ParsedSemverVersion {
    const [ major, minor, patch ] = version.split( '-' )[ 0 ].split( '.' ).map( Number );
    return { major, minor, patch };
  }

  private static compare ( a: ParsedSemverVersion, b: ParsedSemverVersion ) : number {
    if ( a.major !== b.major ) return a.major - b.major;
    if ( a.minor !== b.minor ) return a.minor - b.minor;
    return a.patch - b.patch;
  }

  private static satisfies ( version: string, range: string ) : boolean {
    const opMatch = range.match( /^(^|~|>=|<=|>|<|=)/ );
    const op = opMatch?.[ 1 ] as SemverOperator | undefined;

    const raw = op ? range.slice( op.length ) : range;
    const v = this.parse( version );
    const t = this.parse( raw );
    const cmp = this.compare( v, t );

    switch ( op ) {
      case '^': return ( v.major === t.major && ( v.minor > t.minor || ( v.minor === t.minor && v.patch >= t.patch ) ) );
      case '~': return ( v.major === t.major && v.minor === t.minor && v.patch >= t.patch );
      case '>': return cmp > 0;
      case '>=': return cmp >= 0;
      case '<': return cmp < 0;
      case '<=': return cmp <= 0;
      case '=': case undefined: return cmp === 0;
    }
  }

  private static isCompatible ( plugin: PluginDefinition, selection: Selection ) : boolean {
    const deps = plugin.dependencies ?? {};

    for ( const [ depId, range ] of Object.entries( deps ) ) {
      const dep = selection.get( depId );

      if ( ! dep ) continue;
      if ( ! this.satisfies( dep.version, range ) ) return false;
    }

    for ( const [ , selected ] of selection ) {
      const selDeps = selected.dependencies ?? {};
      const range = selDeps[ plugin.id ];

      if ( range && ! this.satisfies( plugin.version, range ) ) return false;
    }

    return true;
  }

  public static resolve () : ReadonlyArray< PluginDefinition > {
    if ( PluginLoader.size === 0 ) return [] as const;

    const catalog = PluginLoader.catalog;
    const ids = [ ...catalog.keys() ].sort( ( a, b ) =>
      ( catalog.get( a )?.length ?? 0 ) -
      ( catalog.get( b )?.length ?? 0 )
    );

    const selection: Selection = new Map();

    const visiting = new Set< string >();
    const visited = new Set< string >();

    const resolveNode = ( idx: number ) : boolean => {
      return true;
    }

    if ( ! resolveNode( 0 ) ) throw new Error(
      'No consistent plugin configuration found'
    );

    return [ ...selection.values() ] as const;
  }
}

export const resolvePlugins = () => PluginResolver.resolve();
