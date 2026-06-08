import type { PluginDefinition, PluginOverrides } from '@unitra/types/core/plugin';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { createFactoryContainer } from '../system/factory';
import { createHookAccessor } from '../system/hook';
import { createRegistryContainer } from '../system/registry';
import { createServiceContainer } from '../system/service';
import { InitError } from '../utils/error';
import { Logging } from '../utils/logging';
import { PluginLoader } from './PluginLoader';
import { PluginResolver } from './PluginResolver';

export class Init {
  private static readonly log = Logging.createSource( 'bootstrap' );
  private static cacheRevision: number = -1;

  public static get version () : number {
    return 1;
  }

  public static get revision () : number {
    return this.cacheRevision;
  }

  private static getPlugins () : ReadonlyArray< PluginDefinition > {
    const { revId, plugins, error } = PluginResolver.resolve();

    if ( error ) {
      console.error( error.format() );
      throw error;
    }

    this.cacheRevision = revId;
    return plugins;
  }

  private static createCtx () : UnitraContext {
    this.log.debug( `create Unitra context (vers. ${ this.version }) ...` );
    return { VERSION: this.version, REVISION: this.revision } as UnitraContext;
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
    Object.freeze( ctx.REVISION );
    Object.freeze( ctx.hook );
    Object.freeze( ctx.registry );
    Object.freeze( ctx.service );
    Object.freeze( ctx.factory );
  }

  public static run () : UnitraContext {
    try {
      const plugins = this.getPlugins();
      const overrides = PluginLoader.overrides( plugins );
      const ctx = this.createCtx();

      this.mountServices( ctx, overrides );
      PluginLoader.load( plugins, ctx );
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
