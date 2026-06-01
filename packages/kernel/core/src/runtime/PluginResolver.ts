import { PluginCatalog, PluginResolveResult } from '@unitra/types/plugin';
import Logging from '@unitra/utils/logging';
import { PluginRegistry } from './PluginRegistry';

export class PluginResolver {
  private static readonly log = Logging.createSource( 'plugin-resolver' );

  private static cacheHash = '';
  private static cache: PluginResolveResult | null = null;

  private static hash ( catalog: PluginCatalog ) : string {
    let hash = '';

    for ( const [ id, list ] of catalog ) {
      hash += id + ':';
      for ( const p of list ) hash += p.version + '|';
      hash += ';';
    }

    return hash;
  }

  public static resolve () : PluginResolveResult {
    const catalog = PluginRegistry.catalog();

    const hash = this.hash( catalog );
    if ( this.cache && this.cacheHash === hash ) {
      this.log.debug( 'cache hit' );
      return this.cache;
    }
  }
}

export const resolvePlugins = () => PluginResolver.resolve();
