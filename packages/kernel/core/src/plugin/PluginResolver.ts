import type { PluginCatalog, PluginDefinition, PluginResolveGraph, PluginResolveResult } from '@unitra/types/core/plugin';
import type { SemverRange } from '@unitra/types/utils/semver';
import { Logging } from '../utils/logging';
import { Semver } from '../utils/semver';

type Requirements = Map< string, Array< {
  plugin: PluginDefinition;
  range: SemverRange;
} > >;

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
    const missing: string[] = [];

    for ( const [ id, list ] of req )
      if ( ! catalog.has( id ) )
        for ( const r of list )
          this.pushError(
            missing,
            `${ r.plugin.id } → missing ${ id }@${ r.range }`,
            'not installed'
          );

    return missing;
  }

  private static detectConflicts ( catalog: PluginCatalog, req: Requirements ) : string[] {
    const conflict: string[] = [];

    for ( const [ id, list ] of req ) {
      const versions = catalog.get( id );
      if ( ! versions ) continue;

      const available = versions.map( v => v.version );

      for ( const r of list )
        if ( ! available.some( v => Semver.satisfies( v, r.range ) ) )
          this.pushError(
            conflict,
            `${ r.plugin.id } → conflict ${ id }@${ r.range }`,
            'version mismatch'
          );
    }

    return conflict;
  }
}
