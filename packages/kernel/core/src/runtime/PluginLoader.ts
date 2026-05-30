import type { DependencyMap, PluginDefinition, SemverRange } from '@unitra/types/plugin';

export class PluginLoader {
  private static readonly registry = new Map < string, PluginDefinition > ();

  public static add ( ...plugins: PluginDefinition[] ) : void {
    for ( const plugin of plugins ) {
      const existing = this.get( plugin.id );
      if ( existing && existing.version !== plugin.version ) throw new Error (
        `Plugin with id "${ plugin.id }" already exists with version "${ existing.version }".`
      );

      if ( ! existing ) this.registry.set( plugin.id, plugin );
    }
  }

  public static remove ( ...ids: string[] ) : void {}

  public static has ( id: string, version?: SemverRange ) : boolean {}

  public static get ( id: string ) : PluginDefinition | undefined {}

  public static all () : ReadonlyArray< PluginDefinition > {}

  public static list () : ReadonlyArray< DependencyMap > {}

  public static size () : number {}

  public static clear () : void {}
}

export const addPlugin = ( ...plugins: PluginDefinition[] ) => PluginLoader.add( ...plugins );
export const removePlugin = ( ...ids: string[] ) => PluginLoader.remove( ...ids );
export const hasPlugin = ( id: string, version?: SemverRange ) => PluginLoader.has( id, version );
export const listPlugins = () => PluginLoader.list();
