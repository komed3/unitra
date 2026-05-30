import type { ParsedSemverVersion, PluginResolveResult, SemverVersion } from '@unitra/types/plugin';
import { PluginRegistry } from './PluginRegistry';

export class PluginResolver {
  private static parse ( version: SemverVersion ) : ParsedSemverVersion {
    const [ semver, tag ] = version.split( '-' );
    const [ major, minor, patch ] = semver.split( '.' ).map( Number );

    return { major, minor, patch, tag };
  }

  public static resolve () : PluginResolveResult {
    const catalog = PluginRegistry.catalog;
  }
}

export const resolvePlugins = () => PluginResolver.resolve();
