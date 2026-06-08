import type { PluginOverrides } from '@unitra/types/core/plugin';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../utils/logging';

export class PluginLoader {
  private static readonly log = Logging.createSource( 'plugin-loader' );

  public static load ( ctx: UnitraContext, overrides?: PluginOverrides ) : void {}
}
