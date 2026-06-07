import type { UnitraContext } from '@unitra/types/core/unitra';
import { createFactoryContainer } from '../system/factory';
import { createHookAccessor } from '../system/hook';
import { createRegistryContainer } from '../system/registry';
import { createServiceContainer } from '../system/service';
import { InitError } from '../utils/error';
import { Logging } from '../utils/logging';

export class Init {
  private static readonly log = Logging.createSource( 'bootstrap' );
  private static readonly VERSION = 1;

  public static createCtx () : UnitraContext {
    this.log.debug( `creating Unitra context (vers. ${ this.VERSION }) ...` );
    const ctx = { VERSION: this.VERSION } as UnitraContext;

    try {
      this.log.debug( 'mount hook accessor ...' );
      ctx.hook = createHookAccessor( ctx );

      this.log.debug( 'mount registry container ...' );
      ctx.registry = createRegistryContainer( ctx );

      this.log.debug( 'mount service container ...' );
      ctx.service = createServiceContainer( ctx );

      this.log.debug( 'mount factory container ...' );
      ctx.factory = createFactoryContainer( ctx );

      this.log.debug( 'freezing context ...' );
      Object.freeze( ctx );
      Object.freeze( ctx.VERSION );
      Object.freeze( ctx.hook );
      Object.freeze( ctx.registry );
      Object.freeze( ctx.service );
      Object.freeze( ctx.factory );

      this.log.debug( 'context created successfully' );
      return ctx;
    } catch ( err ) {
      this.log.error( 'failed to create context' );
      throw new InitError( 'failed to create context', { context: {}, cause: err } );
    }
  }
}
