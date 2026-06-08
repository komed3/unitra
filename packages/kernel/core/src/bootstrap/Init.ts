import type { UnitraContext } from '@unitra/types/core/unitra';
import { InitError } from '../utils/error';
import { Logging } from '../utils/logging';

export class Init {
  private static readonly log = Logging.createSource( 'bootstrap' );

  public static get VERSION () : number {
    return 1;
  }

  private static createCtx () : UnitraContext {
    this.log.debug( `create Unitra context (vers. ${ this.VERSION }) ...` );
    const ctx = { VERSION: this.VERSION } as UnitraContext;

    return ctx;
  }

  private static freezeCtx ( ctx: UnitraContext ) {
    Init.log.debug( 'freezing context ...' );
    Object.freeze( ctx );

    Object.freeze( ctx.VERSION );
    Object.freeze( ctx.hook );
    Object.freeze( ctx.registry );
    Object.freeze( ctx.service );
    Object.freeze( ctx.factory );
  }

  public static run () : UnitraContext {
    try {
      const ctx = this.createCtx();
      this.freezeCtx( ctx );

      this.log.debug( 'context created successfully' );
      this.log.debug( 'Unitra is now in ready state' );

      ctx.hook().run( 'core.bootstrap.init', {} );
      return ctx;
    } catch ( err ) {
      this.log.error( 'failed to create context' );
      throw new InitError( 'failed to create context', { context: {}, cause: err } );
    }
  }
}
