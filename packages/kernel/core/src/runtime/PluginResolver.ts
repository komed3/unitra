import { PluginLoader } from './PluginLoader';

export class PluginResolver {
  public static resolve () : ResolvedPlugins {
    const catalog = PluginLoader.all();
  }
}

export const resolvePlugins = () => PluginResolver.resolve();
