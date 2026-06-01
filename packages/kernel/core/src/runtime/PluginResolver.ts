import { PluginResolveResult } from '@unitra/types/plugin';
import Logging from '@unitra/utils/logging';

export class PluginResolver {
  private static readonly logger = Logging.createSource( 'plugin-resolver' );

  private static cacheHash = '';
  private static cache: PluginResolveResult | null = null;

  public static resolve () : PluginResolveResult {}
}

export const resolvePlugins = () => PluginResolver.resolve();
