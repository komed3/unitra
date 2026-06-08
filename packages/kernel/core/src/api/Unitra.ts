import type { IUnitFactory } from '@unitra/types/core/factory';
import type { IRegistry, RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { IAssert, IResolve, ISerialize } from '@unitra/types/core/service';
import type { IUnitra, UnitraContext } from '@unitra/types/core/unitra';
import { Init } from '../bootstrap';
import { getTypedRegistry } from '../system/registry';
import { Logging } from '../utils/logging';

export class Unitra implements IUnitra {
  private static readonly log = Logging.createSource( 'unitra' );
  private static cacheRevision: number = -1;
  private static cache: IUnitra | null = null;

  private readonly ctx: UnitraContext;

  public get version () : number {
    return this.ctx.VERSION;
  }

  public get root () : UnitraContext {
    return this.ctx;
  }

  private constructor () {
    this.ctx = Init.run();
    this.ctx.hook().run( 'core.unitra.create', { self: this } );

    Unitra.log.debug( 'Unitra instance created' );
  }

  public registry < K extends RegistryKey > ( key: K ) : IRegistry< RefOf< K > > {
    return getTypedRegistry( this.ctx, key );
  }

  public assert () : IAssert {
    return this.ctx.service.assert();
  }

  public resolve () : IResolve {
    return this.ctx.service.resolve();
  }

  public serialize () : ISerialize {
    return this.ctx.service.serialize();
  }

  public unit () : IUnitFactory {
    return this.ctx.factory.unit();
  }

  public clone () : IUnitra {
    return Object.assign( Object.create( Object.getPrototypeOf( this ) ), this );
  }

  public static getInstance () : IUnitra {
    if ( ! this.cache || this.cacheRevision !== Init.revision ) {
      this.log.debug( 'cache invalidated, create new instance' );

      this.cacheRevision = Init.revision;
      this.cache = new Unitra();
    }

    return this.cache.clone();
  }
}
