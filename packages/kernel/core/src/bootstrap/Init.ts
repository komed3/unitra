import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../utils/logging';

export class Init {
  private static readonly log = Logging.createSource( 'bootstrap' );

  public get VERSION () : number {
    return 1;
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
}
