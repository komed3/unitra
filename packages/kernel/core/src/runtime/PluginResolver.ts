import type { PluginCatalog, PluginDefinition, PluginResolveGraph, PluginResolveResult } from '@unitra/types/plugin';
import type { SemverRange } from '@unitra/types/semver';
import Logging from '@unitra/utils/logging';
import { PluginRegistry } from './PluginRegistry';

type Requirements = Map< string, Array< {
  plugin: PluginDefinition;
  range: SemverRange;
} > >;

export class PluginResolver {
  private static readonly log = Logging.createSource( 'plugin-resolver' );

  private static cacheHash = '';
  private static cache: PluginResolveResult | null = null;

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
