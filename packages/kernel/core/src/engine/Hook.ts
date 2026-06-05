import type { HookCtx, HookDef, HookHandler, HookId, HookPipeline, HookValue } from '@unitra/types/core/hook';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../utils';

class HookStorage extends Map {
  public override set < K extends HookId > ( id: K, hooks: HookDef< K >[] ) : this {
    return super.set( id, hooks );
  }

  public override get < K extends HookId > ( id: K ) : HookDef< K >[] | undefined {
    return super.get( id );
  }
}

class HookCache extends Map {
  public override set < K extends HookId > ( id: K, fn: HookPipeline< K > ) : this {
    return super.set( id, fn );
  }

  public override get < K extends HookId > ( id: K ) : HookPipeline< K > | undefined {
    return super.get( id );
  }
}

export class Hook {
  private static readonly log = Logging.createSource( 'hook' );
  private readonly hooks = new HookStorage();
  private readonly cache = new HookCache();

  private getPipeline < K extends HookId > ( id: K ) : HookPipeline< K > {
    const cached = this.cache.get( id );
    if ( cached ) return cached;

    const list = [ ...( this.hooks.get( id ) ?? [] ) ].sort(
      ( a, b ) => ( b.priority ?? 0 ) - ( a.priority ?? 0 )
    );

    const pipeline = ( hookCtx: HookCtx< K >, value?: HookValue< K > ) : HookValue< K > | undefined =>
      list.reduce(
        ( v, { handler } ) => handler( this.ctx, hookCtx, v ) as HookValue< K > | undefined,
        value
      );

    this.cache.set( id, pipeline );
    return pipeline;
  }

  constructor ( private readonly ctx: UnitraContext ) {}

  public invalidate ( id: HookId ) : void {
    if ( this.cache.delete( id ) )
      Hook.log.debug( `invalidate cached pipeline for "${ id }"` );
  }

  public add < K extends HookId > ( id: K, handler: HookHandler< K >, priority?: number ) : void {
    Hook.log.debug( `add hook handler for "${ id }" with priority ${ priority ?? 0 }` );

    const list = this.hooks.get( id ) || [];
    list.push( { handler, priority } );
    this.hooks.set( id, list );

    this.invalidate( id );
  }

  public run < K extends HookId > ( id: K, ctx: HookCtx< K > ) : void;
  public run < K extends HookId > ( id: K, ctx: HookCtx< K >, value: HookValue< K > ) : HookValue< K >;

  public run < K extends HookId > ( id: K, ctx: HookCtx< K >, value?: HookValue< K > ) : HookValue< K > | void {
    Hook.log.debug( `run "${ id }"` );
  }
}
