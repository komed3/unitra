import type { PluginCatalog, PluginDefinition, PluginList } from '@unitra/types/plugin';
import type { SemverVersion } from '@unitra/types/semver';
import Logging from '@unitra/utils/logging';

export class PluginRegistry {
  private static readonly logger = Logging.createSource( 'plugin-registry' );
  private static readonly registry = new Map< string, Map< SemverVersion, PluginDefinition > >();

  public static get size () : number {
    return [ ...this.registry.values() ].reduce( ( size, versions ) => size + versions.size, 0 );
  }

  public static add ( ...plugins: PluginDefinition[] ) : void {
    for ( const plugin of plugins ) {
      const versions = this.registry.get( plugin.id ) ?? new Map< SemverVersion, PluginDefinition >();
      const exists = versions.has( plugin.version );

      this.registry.set( plugin.id, versions.set( plugin.version, plugin ) );
      this.logger.debug( `${ exists ? 'updated' : 'registered' } plugin "${ plugin.id }@${ plugin.version }"` );
    }
  }

  public static remove ( id: string, version?: SemverVersion ) : void {
    const versions = this.registry.get( id );
    if ( ! versions ) return;

    const ok = version
      ? ( versions.delete( version ) && versions.size === 0 && this.registry.delete( id ) )
      : ( this.registry.delete( id ) );

    this.logger.debug( `deregistered plugin "${ id }": ${ ok ? 'success' : 'failed' }` );
  }

  public static has ( id: string, version?: SemverVersion ) : boolean {
    const versions = this.registry.get( id );
    return versions ? version ? versions.has( version ) : true : false;
  }

  public static get ( id: string, version?: SemverVersion ) : ReadonlyArray< PluginDefinition > {
    const plugin = this.registry.get( id );
    if ( ! plugin ) return [];

    return version
      ? plugin.get( version ) ? [ plugin.get( version )! ] : []
      : [ ...plugin.values() ];
  }

  public static all () : ReadonlyArray< PluginDefinition > {
    return [ ...this.registry.values() ].flatMap( versions => [ ...versions.values() ] );
  }

  public static list () : PluginList {
    return Object.fromEntries( [ ...this.registry.entries() ].map(
      ( [ id, versions ] ) => [ id, [ ...versions.keys() ] ] )
    );
  }

  public static catalog () : PluginCatalog {
    const catalog: PluginCatalog = new Map();

    for ( const plugin of this.all() ) {
      const list = catalog.get( plugin.id ) ?? [];

      list.push( plugin );
      catalog.set( plugin.id, list );
    }

    return catalog;
  }

  public static clear () : void {
    this.registry.clear();
  }
}

export const addPlugins = ( ...plugins: PluginDefinition[] ) => PluginRegistry.add( ...plugins );
export const addPlugin = ( plugin: PluginDefinition ) => PluginRegistry.add( plugin );
export const removePlugin = ( id: string, version?: SemverVersion ) => PluginRegistry.remove( id, version );
export const hasPlugin = ( id: string, version?: SemverVersion ) => PluginRegistry.has( id, version );
export const listPlugins = () => PluginRegistry.list();
