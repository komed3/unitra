import type { PluginCatalog, PluginDefinition, PluginList, SemverVersion } from '@unitra/types/plugin';

export class PluginRegistry {
  private static readonly registry = new Map< string, Map< SemverVersion, PluginDefinition > >();

  public static get size () : number {
    return Array.from( this.registry.values() ).reduce(
      ( size, versions ) => size + versions.size, 0
    );
  }

  public static get catalog () : PluginCatalog {
    const catalog: PluginCatalog = new Map();

    for ( const plugin of PluginRegistry.all() ) {
      const list = catalog.get( plugin.id ) ?? [];

      list.push( plugin );
      catalog.set( plugin.id, list );
    }

    return catalog;
  }

  public static add ( ...plugins: PluginDefinition[] ) : void {
    for ( const plugin of plugins ) this.registry.set( plugin.id, (
      this.registry.get( plugin.id ) ||
      new Map< SemverVersion, PluginDefinition >()
    ).set( plugin.version, plugin ) );
  }

  public static remove ( id: string, version?: SemverVersion ) : void {
    const versions = this.registry.get( id );
    if ( ! versions ) return;

    version ? (
      versions.delete( version ) &&
      versions.size === 0 &&
      this.registry.delete( id )
    ) : (
      this.registry.delete( id )
    );
  }

  public static has ( id: string, version?: SemverVersion ) : boolean {
    const versions = this.registry.get( id );

    return versions ? (
      version
        ? versions.has( version )
        : true
    ) : false;
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

  public static clear () : void {
    this.registry.clear();
  }
}

export const addPlugins = ( ...plugins: PluginDefinition[] ) => PluginRegistry.add( ...plugins );
export const addPlugin = ( plugin: PluginDefinition ) => PluginRegistry.add( plugin );
export const removePlugin = ( id: string, version?: SemverVersion ) => PluginRegistry.remove( id, version );
export const hasPlugin = ( id: string, version?: SemverVersion ) => PluginRegistry.has( id, version );
export const listPlugins = () => PluginRegistry.list();
