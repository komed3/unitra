import type { IUnitFactory } from '@unitra/types/core/factory';
import type { FormatterOptions, FormatterType } from '@unitra/types/core/formatter';
import type { ParserResult } from '@unitra/types/core/parser';
import type { IRegistry, RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { IAssert, IResolve } from '@unitra/types/core/service';
import type { IUnitra, UnitraContext } from '@unitra/types/core/unitra';
import type { ReferenceState } from '@unitra/types/node';
import { Init } from '../bootstrap';
import { getTypedRegistry } from '../system/registry';
import { UnitraError } from '../utils/error';
import { Logging } from '../utils/logging';

export class Unitra implements IUnitra {
  private static readonly log = Logging.createSource( 'unitra' );
  private static cacheRevision: number = -1;
  private static cache: IUnitra | null = null;

  private readonly ctx: UnitraContext;

  private catchToErr < T > ( fn: () => T ) : T {
    try { return fn() }
    catch ( err ) {
      Unitra.log.error( err instanceof Error ? err.message : 'unknown error occurred' );
      throw err instanceof UnitraError ? err : new UnitraError(
        'unknown error occurred', { context: {}, cause: err }
      );
    }
  }

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
    return this.catchToErr( () => getTypedRegistry( this.ctx, key ) );
  }

  public assert () : IAssert {
    return this.catchToErr( () => this.ctx.service.assert() );
  }

  public resolve () : IResolve {
    return this.catchToErr( () => this.ctx.service.resolve() );
  }

  public serialize ( input: ReferenceState ) : string {
    return this.catchToErr( () => this.ctx.service.serialize().fromReferenceState( input ) );
  }

  public parse ( input: unknown ) : ParserResult {
    return this.catchToErr( () => this.ctx.parser().parse( input ) );
  }

  public format ( as: FormatterType, state: ReferenceState, options?: FormatterOptions, value?: number ) : string {
    return this.catchToErr( () => this.ctx.formatter[ as ]().out( state, options, value ) );
  }

  public unit () : IUnitFactory {
    return this.catchToErr( () => this.ctx.factory.unit() );
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

    return this.cache;
  }
}
