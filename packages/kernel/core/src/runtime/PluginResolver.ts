import type { PluginResolveResult } from '@unitra/types/plugin';
import { PluginRegistry } from './PluginRegistry';

export class PluginResolver {
  public static resolve () : PluginResolveResult {
    const catalog = PluginRegistry.catalog;
  }
}

export const resolvePlugins = () => PluginResolver.resolve();
