import type { PluginDefinition } from '@unitra/types/core/plugin';
import type { SemverVersion } from '@unitra/types/utils/semver';
import { Logging } from '../utils/logging';

export class PluginRegistry {
  private static readonly log = Logging.createSource( 'plugin-registry' );
  private static readonly registry = new Map< string, Map< SemverVersion, PluginDefinition > >();
  private static revId: number = 0;

  public static get size () : number {
    return [ ...this.registry.values() ].reduce( ( size, versions ) => size + versions.size, 0 );
  }

  public static get revision () : number {
    return this.revId;
  }

  public static clear () : void {
    this.registry.clear();
    this.revId++;
  }

  public static add ( ...plugins: PluginDefinition[] ) : void {
    let updated = false;

    for ( const plugin of plugins ) {
      const versions = this.registry.get( plugin.id ) ?? new Map< SemverVersion, PluginDefinition >();
      const exists = versions.get( plugin.version );

      if ( plugin === exists ) {
        this.log.debug( `skip "${ plugin.id }@${ plugin.version }" plugin: already registered` );
        continue;
      }

      this.registry.set( plugin.id, versions.set( plugin.version, plugin ) );
      this.log.debug( `${ exists ? 'updated' : 'registered' } plugin "${ plugin.id }@${ plugin.version }"` );
      updated = true;
    }

    ( updated && this.revId++ );
  }

  public static remove ( id: string, version?: SemverVersion ) : void {
    const versions = this.registry.get( id );
    if ( ! versions ) return;

    const ok = version
      ? ( versions.delete( version ) && versions.size === 0 && this.registry.delete( id ) )
      : ( this.registry.delete( id ) );

    this.log.debug( `deregistered plugin "${ id }": ${ ok ? 'success' : 'failed' }` );
    ( ok && this.revId++ );
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
}
