import type { HookCtx, HookDef, HookHandler, HookId, HookImplMap, HookPipeline, HookValue, IHookEngine } from '@unitra/types/hook';
import { HookRunnerError } from '@unitra/utils/error';
import Logging from '@unitra/utils/logging';

class HookStorage extends Map {
  public override set < K extends HookId > ( id: K, hooks: HookDef< K >[] ) : this { return super.set( id, hooks ) }
  public override get < K extends HookId > ( id: K ) : HookDef< K >[] | undefined { return super.get( id ) }
}

class HookCache extends Map {
  public override set < K extends HookId > ( id: K, fn: HookPipeline< K > ) : this { return super.set( id, fn ) }
  public override get < K extends HookId > ( id: K ) : HookPipeline< K > | undefined { return super.get( id ) }
}

export class HookEngine implements IHookEngine {
  private static readonly log = Logging.createSource( 'hook' );

  private readonly hooks = new HookStorage();
  private readonly cache = new HookCache();

  private getPipeline < K extends HookId > ( id: K ) : HookPipeline< K > {
    const cached = this.cache.get( id );
    if ( cached ) return cached;

    const list = ( this.hooks.get( id ) ?? [] );
    const sorted = list.slice().sort( ( a, b ) => ( b.priority ?? 0 ) - ( a.priority ?? 0 ) );

    const pipeline = ( ctx: HookCtx< K >, value?: HookValue< K > ) : HookValue< K > | undefined =>
      sorted.reduce( ( v, { handler } ) => handler( ctx, v ) as HookValue< K > | undefined, value );

    this.cache.set( id, pipeline );
    return pipeline;
  }

  constructor () {}

  public invalidate ( id: HookId ) : void {
    HookEngine.log.debug( `invalidate cached pipeline for "${ id }"` );
    this.cache.delete( id );
  }

  public add < K extends HookId > ( id: K, handler: HookHandler< K >, priority?: number ) : void {
    const list = this.hooks.get( id ) || [];
    list.push( { handler, priority } );
    this.hooks.set( id, list );

    this.invalidate( id );
  }

  public merge ( hooks: HookImplMap ) : void {
    for ( const [ key, incoming ] of Object.entries( hooks ) as { [ K in HookId ]: [ K, HookDef< K >[] ] }[ HookId ][] ) {
      if ( ! incoming?.length ) continue;

      const existing = this.hooks.get( key );
      if ( existing ) existing.push( ...incoming );
      else this.hooks.set( key, [ ...incoming ] );

      this.invalidate( key );
    }
  }

  public run < K extends HookId > ( id: K, ctx: HookCtx< K > ) : void;
  public run < K extends HookId > ( id: K, ctx: HookCtx< K >, value: HookValue< K > ) : HookValue< K >;

  public run < K extends HookId > ( id: K, ctx: HookCtx< K >, value?: HookValue< K > ) : HookValue< K > | void {
    HookEngine.log.debug( `run "${ id }"` );

    try { return this.getPipeline( id )( ctx, value ) }
    catch ( err ) { throw new HookRunnerError< K >( `failed to run hook for "${ id }"`, {
      data: { id, ctx, value }, cause: err
    } ) }
  }
}
