import type { PluginCatalog, PluginDefinition, SemverVersion } from '@unitra/types/plugin';

export class PluginLoader {
  private static readonly registry = new Map< string, Map< SemverVersion, PluginDefinition > >();

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

  public static list () : PluginCatalog {
    return Object.fromEntries( [ ...this.registry.entries() ].map(
      ( [ id, versions ] ) => [ id, [ ...versions.keys() ] ] )
    );
  }

  public static size () : number {
    return Array.from( this.registry.values() ).reduce(
      ( size, versions ) => size + versions.size, 0
    );
  }

  public static clear () : void {
    this.registry.clear();
  }
}

export const addPlugin = ( ...plugins: PluginDefinition[] ) => PluginLoader.add( ...plugins );
export const removePlugin = ( id: string, version?: SemverVersion ) => PluginLoader.remove( id, version );
export const hasPlugin = ( id: string, version?: SemverVersion ) => PluginLoader.has( id, version );
export const listPlugins = () => PluginLoader.list();
