import type { ParsedSemverVersion, PluginResolveResult, SemverVersion } from '@unitra/types/plugin';
import { PluginRegistry } from './PluginRegistry';

export class PluginResolver {
  private static parse ( version: SemverVersion ) : ParsedSemverVersion {
    const [ semver, tag ] = version.split( '-' );
    const [ major, minor, patch ] = semver.split( '.' ).map( Number );

    return { major, minor, patch, tag };
  }

  private static compare ( a: ParsedSemverVersion, b: ParsedSemverVersion ) : number {
    if ( a.major !== b.major ) return a.major - b.major;
    if ( a.minor !== b.minor ) return a.minor - b.minor;
    return a.patch - b.patch;
  }

  public static resolve () : PluginResolveResult {
    const catalog = PluginRegistry.catalog;
  }
}

export const resolvePlugins = () => PluginResolver.resolve();
