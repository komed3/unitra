import { AnyRef } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';

export class Parser {
  private readonly tokens: any;

  private populateTokens () : void {
    for ( const [ key, reg ] of Object.entries( this.ctx.registry ) ) {
      const map = new Map< string, AnyRef >();

      for ( const entry of reg().values() ) {
        map.set( entry.id, entry.id );
      }
    }
  }

  constructor ( private readonly ctx: UnitraContext ) {}

  public test () {
    this.populateTokens();
  }
}
