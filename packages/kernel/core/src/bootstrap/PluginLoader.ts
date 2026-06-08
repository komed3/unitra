import type { PluginDefinition, PluginOverrides } from '@unitra/types/core/plugin';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../utils/logging';

export class PluginLoader {
  private static readonly log = Logging.createSource( 'plugin-loader' );

  public static overrides ( plugins: ReadonlyArray< PluginDefinition > ) : PluginOverrides {
    const overrides = {} as PluginOverrides;
    return overrides;
  }

  public static load ( plugins: ReadonlyArray< PluginDefinition >, ctx: UnitraContext ) : void {}
}
