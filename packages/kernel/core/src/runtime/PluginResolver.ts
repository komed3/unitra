import type { PluginResolveGraph, PluginCatalog, PluginDefinition, PluginResolveResult, SemverRange } from '@unitra/types/plugin';
import { Semver } from '../utils';
import { PluginRegistry } from './PluginRegistry';

type Requirements = Map< string, Array< {
  plugin: PluginDefinition;
  range: SemverRange;
} > >;

export class PluginResolver {
  private static buildErrorMessage ( missing: string[], conflicts: string[], cycles: string[] ) : string {
    const parts: string[] = [];

    if ( missing.length ) parts.push( `Missing dependencies:\n- ${ missing.join( '\n- ' ) }` );
    if ( conflicts.length ) parts.push( `Version conflicts:\n- ${ conflicts.join( '\n- ' ) }` );
    if ( cycles.length ) parts.push( `Dependency cycles:\n- ${ cycles.join( '\n- ' ) }` );

    return parts.join( '\n\n' );
  }

  private static collectRequirements ( catalog: PluginCatalog ) : Requirements {
    const map: Requirements = new Map();

    for ( const list of catalog.values() ) {
      for ( const plugin of list ) {
        const deps = plugin.dependencies ?? {};

        for ( const [ id, range ] of Object.entries( deps ) ) {
          const arr = map.get( id ) ?? [];
          arr.push( { plugin, range } );
          map.set( id, arr );
        }
      }
    }

    return map;
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

  private static detectMissing ( catalog: PluginCatalog, reqs: Requirements ) : string[] {
    const out: string[] = [];

    for ( const [ id, list ] of reqs ) {
      if ( ! catalog.has( id ) ) {
        for ( const r of list ) out.push(
          `${ r.plugin.id } requires ${ id }@${ r.range } (not installed)`
        );
      }
    }

    return out;
  }

  private static detectConflicts ( catalog: PluginCatalog, reqs: Requirements ) : string[] {
    const out: string[] = [];

    for ( const [ id, list ] of reqs ) {
      const versions = catalog.get( id );
      if ( ! versions ) continue;

      const available = versions.map( v => v.version );

      for ( const req of list ) {
        if ( ! available.some( v => Semver.satisfies( v, req.range ) ) ) out.push(
          `${ req.plugin.id } requires ${ id }@${ req.range } but none of [${ available.join( ', ' ) }] satisfy it`
        );
      }
    }

    return out;
  }

  private static detectCycles ( graph: PluginResolveGraph ) : string[] {
    const visited = new Set< string >();
    const stack = new Set< string >();
    const path: string[] = [];
    const cycles: string[] = [];

    const dfs = ( node: string ) => {
      if ( stack.has( node ) ) {
        const start = path.indexOf( node );
        cycles.push( path.slice( start ).concat( node ).join( ' -> ' ) );
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

    for ( const node of graph.keys() ) dfs( node );
    return cycles;
  }

  private static topologicalSort ( graph: PluginResolveGraph, catalog: PluginCatalog ) : ReadonlyArray< PluginDefinition > {
    const visited = new Set< string >();
    const result: PluginDefinition[] = [];

    const visit = ( node: string ) => {
      if ( visited.has( node ) ) return;
      visited.add( node );

      for ( const dep of graph.get( node ) ?? [] ) visit( dep );
      for ( const p of catalog.get( node ) ?? [] ) result.push( p );
    };

    for ( const node of graph.keys() ) visit( node );
    return result;
  }

  public static resolve () : PluginResolveResult {
    if ( PluginRegistry.size === 0 ) return { graph: new Map(), plugins: [] as const };

    const catalog = PluginRegistry.catalog();
    const requirements = this.collectRequirements( catalog );
    const graph = this.buildGraph( catalog );

    const missing = this.detectMissing( catalog, requirements );
    const conflicts = this.detectConflicts( catalog, requirements );
    const cycles = this.detectCycles( graph );

    if ( missing.length || conflicts.length || cycles.length ) return {
      plugins: [], graph, error: {
        message: this.buildErrorMessage( missing, conflicts, cycles ),
        missing, conflicts, cycles
      }
    };

    return { graph, plugins: this.topologicalSort( graph, catalog ) };
  }
}

export const resolvePlugins = () => PluginResolver.resolve();
