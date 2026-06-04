import type { PluginResolveResult } from '@unitra/types/core/plugin';
import { Logging } from '../utils/logging';

export class PluginResolver {
  private static readonly log = Logging.createSource( 'plugin-resolver' );
  private static cacheRevision: number = -1;
  private static cache: PluginResolveResult | null = null;
}
