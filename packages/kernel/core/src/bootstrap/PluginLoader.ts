import type { PluginDefinition, PluginOverrides } from '@unitra/types/core/plugin';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../utils/logging';

export class PluginLoader {
  private static readonly log = Logging.createSource( 'plugin-loader' );

  public static overrides ( plugins: ReadonlyArray< PluginDefinition > ) : PluginOverrides {
    this.log.debug( 'resolving plugin overrides ...' );
    const overrides: PluginOverrides = {};

    const merge = < T extends object > (
      target: T, source: Partial< T > | undefined,
      plugin: PluginDefinition, type: string
    ) : void => {
      if ( ! source ) return;

      for ( const key of Object.keys( source ) )
        this.log.debug( `plugin "${ plugin.id }" overrides ${ type }.${ key } -> ${
          ( source[ key as keyof T ] as CallableFunction )?.name || 'anonymous'
        }` );

      Object.assign( target, source );
    };

    for ( const plugin of plugins ) {
      merge( overrides.factory ??= {}, plugin.overrides?.factory, plugin, 'factory' );
      merge( overrides.registry ??= {}, plugin.overrides?.registry, plugin, 'registry' );
      merge( overrides.service ??= {}, plugin.overrides?.service, plugin, 'service' );
    }

    return overrides;
  }

  public static load ( plugins: ReadonlyArray< PluginDefinition >, ctx: UnitraContext ) : void {}
}
