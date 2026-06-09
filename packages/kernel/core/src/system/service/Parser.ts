import type { AnyRef, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';

type TokenCache = Map< RegistryKey, Map< string, AnyRef > >;

export class Parser {
  private tokenCache?: TokenCache;

  private populateTokenCache () : TokenCache {
    const tokens: TokenCache = new Map();

    for ( const [ key, reg ] of Object.entries( this.ctx.registry ) ) {
      const map = new Map< string, AnyRef >();

      for ( const entry of reg().values() ) {
        map.set( entry.id, entry.id );

        if ( 'aliases' in entry && entry.aliases?.length )
          for ( const alias of entry.aliases )
            map.set( alias, entry.id );
      }

      tokens.set( key as RegistryKey, map );
    }

    return tokens;
  }

  constructor ( private readonly ctx: UnitraContext ) {}

  public parse ( value: string ) {
    const tokens = this.tokenCache ??= this.populateTokenCache();
  }
}
