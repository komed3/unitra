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
}
