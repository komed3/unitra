import type { PluginCatalog, PluginDefinition, PluginRequirements, PluginResolveGraph, PluginResolveResult } from '@unitra/types/core/plugin';
import { PluginResolveError } from '../utils/error';
import { Logging } from '../utils/logging';
import { Semver } from '../utils/Semver';
import { PluginRegistry } from './PluginRegistry';

export class PluginResolver {
  private static readonly log = Logging.createSource( 'plugin-resolver' );
  private static cacheRevision: number = -1;
  private static cache: PluginResolveResult | null = null;

  private static pushError ( obj: string[], msg: string, label?: string ) : void {
    this.log.error( `${ label ? `${ label } ::` : '' } ${ msg }` );
    obj.push( msg );
  }

  private static buildGraph ( catalog: PluginCatalog ) : PluginResolveGraph {
    const graph: PluginResolveGraph = new Map();

    for ( const [ id, list ] of catalog ) {
      const edges = new Set< string >();

      for ( const plugin of list )
        for ( const dep of Object.keys( plugin.dependencies ?? {} ) )
          edges.add( dep );

      graph.set( id, edges );
    }

    return graph;
  }

  private static buildRequirements ( catalog: PluginCatalog ) : PluginRequirements {
    const req: PluginRequirements = new Map();

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

  private static detectMissing ( catalog: PluginCatalog, req: PluginRequirements ) : string[] {
    const missing: string[] = [];

    for ( const [ id, list ] of req )
      if ( ! catalog.has( id ) )
        for ( const r of list )
          this.pushError( missing, `${ r.plugin.id } → missing ${ id }@${ r.range }`, 'not installed' );

    return missing;
  }

  private static detectConflicts ( catalog: PluginCatalog, req: PluginRequirements ) : string[] {
    const conflicts: string[] = [];

    for ( const [ id, list ] of req ) {
      const versions = catalog.get( id );
      if ( ! versions ) continue;

      const available = versions.map( v => v.version );

      for ( const r of list )
        if ( ! available.some( v => Semver.satisfies( v, r.range ) ) )
          this.pushError( conflicts, `${ r.plugin.id } → conflict ${ id }@${ r.range }`, 'version mismatch' );
    }

    return conflicts;
  }

  private static detectCycles ( graph: PluginResolveGraph ) : string[] {
    const visited = new Set< string >(), stack = new Set< string >();
    const path: string[] = [], cycles: string[] = [];

    const dfs = ( node: string ) => {
      if ( stack.has( node ) ) {
        const i = path.indexOf( node );
        this.pushError( cycles, path.slice( i ).concat( node ).join( ' → ' ), 'cycle detected' );

        return;
      }

      if ( visited.has( node ) ) return;

      visited.add( node );
      stack.add( node );
      path.push( node );

      for ( const n of graph.get( node ) ?? [] ) dfs( n );

      stack.delete( node );
      path.pop();
    };

    for ( const n of graph.keys() ) dfs( n );
    return cycles;
  }

  private static detectOverrideConflicts ( catalog: PluginCatalog ) : string[] {
    const index = new Map< string, Set< string > >();
    const conflicts: string[] = [];

    const add = ( id: string, ns: string, key: string ) =>
      index.set( `${ ns }.${ key }`, ( index.get( `${ ns }.${ key }` ) ?? new Set() ).add( id ) );

    for ( const list of catalog.values() )
      for ( const { id, overrides } of list )
        for ( const [ ns, map ] of Object.entries( overrides ?? {} ) )
          for ( const k of Object.keys( map ?? {} ) )
            add( id, ns, k );

    for ( const [ key, list ] of index )
      if ( list.size > 1 )
        this.pushError( conflicts, `${ key } → ${ [ ...list ].join( ', ' ) }`, 'override conflict' );

    return conflicts;
  }

  private static selectVersions ( catalog: PluginCatalog ) : PluginCatalog {
    const selected: PluginCatalog = new Map();

    for ( const [ id, list ] of catalog ) {
      const sorted = [ ...list ].sort( ( a, b ) => Semver.compareVersions( b.version, a.version ) );
      const best = sorted[ 0 ];

      selected.set( id, [ best ] );

      for ( let i = 1; i < sorted.length; i++ )
        this.log.debug( `skip plugin "${ sorted[ i ].id }@${ sorted[ i ].version }" (using ${ best.version })` );
    }

    return selected;
  }

  private static topologicalSort ( graph: PluginResolveGraph, catalog: PluginCatalog ) : PluginDefinition[] {
    const visited = new Set< string >();
    const result: PluginDefinition[] = [];

    const visit = ( node: string ) => {
      if ( visited.has( node ) ) return;
      visited.add( node );

      for ( const dep of graph.get( node ) ?? [] ) visit( dep );
      for ( const p of catalog.get( node ) ?? [] ) result.push( p );
    };

    for ( const n of graph.keys() ) visit( n );
    return result;
  }

  public static resolve () : PluginResolveResult {
    const revision = PluginRegistry.revision;

    if ( this.cache && this.cacheRevision === revision ) {
      this.log.debug( 'cache hit' );
      return this.cache;
    }

    this.log.debug( 'resolving plugin catalog ...' );

    const catalog = PluginRegistry.catalog();
    const graph = this.buildGraph( catalog );
    const requirements = this.buildRequirements( catalog );

    this.log.debug( 'check for dependency inconsistencies ...' );

    const missing = this.detectMissing( catalog, requirements );
    const conflicts = this.detectConflicts( catalog, requirements );
    const cycles = this.detectCycles( graph );
    const overrides = this.detectOverrideConflicts( catalog );
    const errCount = missing.length + conflicts.length + cycles.length + overrides.length;

    if ( errCount ) {
      this.log.debug( 'resolution failed', { errors: errCount } );

      return {
        ref: this.cacheRevision, plugins: [], graph,
        error: new PluginResolveError(
          `resolution failed due to errors (${ errCount })`,
          { context: { graph, missing, conflicts, cycles, overrides, errCount } }
        )
      };
    }

    this.log.debug( 'building plugin list ...' );
    const selected = this.selectVersions( catalog );
    const plugins = this.topologicalSort( graph, selected );
    const result = { ref: this.cacheRevision, graph, plugins };

    this.cache = result;
    this.cacheRevision = revision;

    this.log.debug( 'successfully resolved', { plugins: plugins.length } );
    return result;
  }
}

export const resolvePlugins = () => PluginResolver.resolve();
