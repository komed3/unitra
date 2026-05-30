import type { PluginDefinition } from '@unitra/types/plugin';

export class PluginLoader {
  private static registry = new Map < string, PluginDefinition > ();

  public static add ( ...plugins: PluginDefinition[] ) : void {}
  public static remove ( ...ids: string[] ) : void {}

  public static has ( id: string ) : boolean {}
  public static get ( id: string ) : PluginDefinition | undefined {}
  public static all () : ReadonlyArray< PluginDefinition > {}

  public static list () : ReadonlyArray< string > {}
  public static size () : number {}

  public static clear () : void {}
}

export const addPlugin = ( ...plugins: PluginDefinition[] ) => PluginLoader.add( ...plugins );
export const removePlugin = ( ...ids: string[] ) => PluginLoader.remove( ...ids );
export const hasPlugin = ( id: string ) => PluginLoader.has( id );
export const listPlugins = () => PluginLoader.list();
