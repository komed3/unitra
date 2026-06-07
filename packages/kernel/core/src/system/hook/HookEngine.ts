import type { HookCtx, HookEntries, HookHandler, HookId, HookImplMap, HookPipeline, HookValue } from '@unitra/types/core/hook';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { HookError } from '../../utils/error';
import { Logging } from '../../utils/logging';
import { HookCache } from './HookCache';
import { HookStorage } from './HookStorage';

export class HookEngine {
  private static readonly log = Logging.createSource( 'hook' );
  private readonly hooks = new HookStorage();
  private readonly cache = new HookCache();

  constructor ( private readonly ctx: UnitraContext ) {}

  private getPipeline < K extends HookId > ( id: K ) : HookPipeline< K > {
    const cached = this.cache.get( id );
    if ( cached ) return cached;

    const list = [ ...( this.hooks.get( id ) ?? [] ) ].sort(
      ( a, b ) => ( b.priority ?? 0 ) - ( a.priority ?? 0 )
    );

    const pipeline = ( hookCtx: HookCtx< K >, value?: HookValue< K > ) =>
      list.reduce( ( v, { handler } ) => handler( this.ctx, hookCtx, v ) as HookValue< K >, value );

    this.cache.set( id, pipeline );
    return pipeline;
  }

  public invalidate ( id: HookId ) : void {
    if ( this.cache.delete( id ) )
      HookEngine.log.debug( `invalidate cached pipeline for "${ id }"` );
  }
  
  public add < K extends HookId > ( id: K, handler: HookHandler< K >, priority?: number ) : void {
    HookEngine.log.debug( `add hook for "${ id }" with priority ${ priority ?? 0 }` );

    const list = this.hooks.get( id ) || [];
    list.push( { handler, priority } );
    this.hooks.set( id, list );

    this.invalidate( id );
  }

  public merge ( hooks: HookImplMap ) : void {
    for ( const [ id, incoming ] of Object.entries( hooks ) as HookEntries ) {
      if ( ! incoming || incoming.length === 0 ) continue;

      const existing = this.hooks.get( id ) ?? [];
      this.hooks.set( id, [ ...existing, ...incoming ] );

      this.invalidate( id );
    }
  }

  public run < K extends HookId > ( id: K, hookCtx: HookCtx< K > ) : void;
  public run < K extends HookId > ( id: K, hookCtx: HookCtx< K >, value: HookValue< K > ) : HookValue< K >;

  public run < K extends HookId > ( id: K, hookCtx: HookCtx< K >, value?: HookValue< K > ) : HookValue< K > {
    HookEngine.log.debug( `run "${ id }"` );

    try { return this.getPipeline( id )( hookCtx, value ) as HookValue< K > }
    catch ( err ) { throw new HookError( `failed to run hook for "${ id }"`, {
      context: { id, hookCtx, value }, cause: err
    } ) }
  }
}
