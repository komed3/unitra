import type { DependencyMap, PluginDefinition, SemverRange } from '@unitra/types/plugin';

export class PluginLoader {
  private static readonly registry = new Map < string, PluginDefinition > ();

  public static add ( ...plugins: PluginDefinition[] ) : void {
    for ( const plugin of plugins ) {
      const existing = this.get( plugin.id );
      if ( existing && existing.version !== plugin.version ) throw new Error (
        `Plugin with id "${ plugin.id }" already exists with version "${ existing.version }".`
      );

      this.registry.set( plugin.id, plugin );
    }
  }

  public static remove ( ...ids: string[] ) : void {
    for ( const id of ids ) this.registry.delete( id );
  }

  public static has ( id: string, version?: SemverRange ) : boolean {
    const existing = this.get( id );
    return !!( existing && ( existing.version === ( version ?? existing.version ) ) );
  }

  public static get ( id: string ) : PluginDefinition | undefined {
    return this.registry.get( id );
  }

  public static all () : ReadonlyArray< PluginDefinition > {
    return Object.freeze( Array.from( this.registry.values() ) );
  }

  public static list () : ReadonlyArray< DependencyMap > {}

  public static size () : number {
    return this.registry.size;
  }

  public static clear () : void {
    this.registry.clear();
  }
}

export const addPlugin = ( ...plugins: PluginDefinition[] ) => PluginLoader.add( ...plugins );
export const removePlugin = ( ...ids: string[] ) => PluginLoader.remove( ...ids );
export const hasPlugin = ( id: string, version?: SemverRange ) => PluginLoader.has( id, version );
export const listPlugins = () => PluginLoader.list();
