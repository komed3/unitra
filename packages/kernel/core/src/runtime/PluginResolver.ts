import type { ParsedSemverVersion } from '@unitra/types/plugin';
import { PluginLoader } from './PluginLoader';

export class PluginResolver {
  private static parse ( version: string ) : ParsedSemverVersion {
    const [ major, minor, patch ] = version.split( '-' )[ 0 ].split( '.' ).map( Number );
    return { major, minor, patch };
  }

  public static resolve () {
    //
  }
}

export const resolvePlugins = () => PluginResolver.resolve();
