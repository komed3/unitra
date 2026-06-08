import type { UnitraContext } from '@unitra/types/core/unitra';
import { Init } from '../bootstrap';
import { Logging } from '../utils/logging';

export class Unitra {
  private static readonly log = Logging.createSource( 'unitra' );
  private static cacheRevision: number = -1;
  private static cache: Unitra | null = null;

  private readonly ctx: UnitraContext;

  private constructor () {
    this.ctx = Init.run();
    this.ctx.hook().run( 'core.unitra.create', {} );
  }

  public clone () : Unitra {
    return Object.assign( Object.create( Object.getPrototypeOf( this ) ), this );
  }

  public static getInstance () : Unitra {
    if ( ! this.cache || this.cacheRevision !== Init.revision ) {
      this.log.debug( 'cache invalidated, create new instance' );

      this.cacheRevision = Init.revision;
      this.cache = new Unitra();
    }

    return this.cache.clone();
  }
}
