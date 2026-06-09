import type { AnyRef } from '@unitra/types/core/registry';
import type { ParserResult, TokenCache } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';

export class Parser {
  private tokenCache: TokenCache | undefined;

  constructor ( private readonly ctx: UnitraContext ) {}

  private get token () : TokenCache {
    return this.tokenCache ??= ( () => {
      const tokens: TokenCache = new Map();

      for ( const [ key, reg ] of Object.entries( this.ctx.registry ) ) {
        const map = new Map< string, AnyRef >();

        for ( const item of reg().values() ) {}
      }

      return tokens;
    } )();
  }

  public parse ( input: string ) : ParserResult {
    return { state: { nodes: [] } };
  }
}
