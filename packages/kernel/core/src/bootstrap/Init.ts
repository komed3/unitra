import type { PluginOverrides } from '@unitra/types/core/plugin';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { createFactoryContainer } from '../system/factory';
import { createHookAccessor } from '../system/hook';
import { createRegistryContainer } from '../system/registry';
import { createServiceContainer } from '../system/service';
import { InitError } from '../utils/error';
import { Logging } from '../utils/logging';

export class Init {
  private static readonly log = Logging.createSource( 'bootstrap' );

  public static get VERSION () : number {
    return 1;
  }

  private static createCtx () : UnitraContext {
    this.log.debug( `create Unitra context (vers. ${ this.VERSION }) ...` );
    return { VERSION: this.VERSION } as UnitraContext;
  }

  private static mountServices ( ctx: UnitraContext, overrides: PluginOverrides ) : void {
    this.log.debug( 'mount hook accessor ...' );
    ctx.hook = createHookAccessor( ctx );

    this.log.debug( 'mount registry container ...' );
    ctx.registry = createRegistryContainer( ctx, overrides.registry );

    this.log.debug( 'mount service container ...' );
    ctx.service = createServiceContainer( ctx, overrides.service );

    this.log.debug( 'mount factory container ...' );
    ctx.factory = createFactoryContainer( ctx, overrides.factory );
  }

  private static freezeCtx ( ctx: UnitraContext ) : void {
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
      const overrides = {} as PluginOverrides;

      this.mountServices( ctx, overrides );
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
