import type { PluginCatalog, PluginDefinition, PluginResolveGraph, PluginResolveResult } from '@unitra/types/plugin';
import type { SemverRange } from '@unitra/types/semver';
import Logging from '@unitra/utils/logging';
import { Semver } from '@unitra/utils/semver';
import { PluginRegistry } from './PluginRegistry';

type Requirements = Map< string, Array< {
  plugin: PluginDefinition;
  range: SemverRange;
} > >;

export class PluginResolver {
  private static readonly log = Logging.createSource( 'plugin-resolver' );

  private static cacheHash = '';
  private static cache: PluginResolveResult | null = null;

  private static err ( obj: string[], msg: string ) : void {
    this.log.error( msg );
    obj.push( msg );
  }

  private static hash ( catalog: PluginCatalog ) : string {
    let hash = '';

    for ( const [ id, list ] of catalog ) {
      hash += id + ':';
      for ( const p of list ) hash += p.version + '|';
      hash += ';';
    }

    return hash;
  }

  private static buildGraph ( catalog: PluginCatalog ) : PluginResolveGraph {
    const graph: PluginResolveGraph = new Map();

    for ( const [ id, list ] of catalog ) {
      const edges = new Set< string >();

      for ( const plugin of list ) {
        for ( const dep of Object.keys( plugin.dependencies ?? {} ) ) {
          edges.add( dep );
        }
      }

      graph.set( id, edges );
    }

    return graph;
  }

  private static buildRequirements ( catalog: PluginCatalog ) : Requirements {
    const req: Requirements = new Map();

    for ( const list of catalog.values() ) {
      for ( const plugin of list ) {
        for ( const [ id, range ] of Object.entries( plugin.dependencies ?? {} ) ) {
          const arr = req.get( id ) ?? [];

          arr.push( { plugin, range } );
          req.set( id, arr );
        }
      }
    }

    return req;
  }

  private static detectMissing ( catalog: PluginCatalog, req: Requirements ) : string[] {
    const out: string[] = [];

    for ( const [ id, list ] of req ) {
      if ( ! catalog.has( id ) ) {
        for ( const r of list ) {
          this.err( out, `${ r.plugin.id } → missing ${ id }@${ r.range }` );
        }
      }
    }

    return out;
  }

  private static detectConflicts ( catalog: PluginCatalog, req: Requirements ) : string[] {
    const out: string[] = [];

    for ( const [ id, list ] of req ) {
      const versions = catalog.get( id );
      if ( ! versions ) continue;

      const available = versions.map( v => v.version );

      for ( const r of list ) {
        if ( ! available.some( v => Semver.satisfies( v, r.range ) ) ) {
          this.err( out, `${ r.plugin.id } → conflict ${ id }@${ r.range }` );
        }
      }
    }

    return out;
  }

  public static resolve () : PluginResolveResult {
    const catalog = PluginRegistry.catalog();

    const hash = this.hash( catalog );
    if ( this.cache && this.cacheHash === hash ) {
      this.log.debug( 'cache hit' );
      return this.cache;
    }

    this.log.debug( 'resolving plugin catalog ...' );

    const graph = this.buildGraph( catalog );
    const requirements = this.buildRequirements( catalog );

    this.log.debug( 'check for dependency inconsistencies ...' );

    const missing = this.detectMissing( catalog, requirements );
    const conflicts = this.detectConflicts( catalog, requirements );
    const cycles = this.detectCycles( graph );
  }
}

export const resolvePlugins = () => PluginResolver.resolve();
