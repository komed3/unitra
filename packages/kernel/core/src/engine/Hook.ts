import type { HookCtx, HookDef, HookEntry, HookHandler, HookId, HookImplMap, HookPipeline, HookValue } from '@unitra/types/core/hook';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { HookError, Logging } from '../utils';

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
      Hook.log.debug( `invalidate cached pipeline for "${ id }"` );
  }

  public add < K extends HookId > ( id: K, handler: HookHandler< K >, priority?: number ) : void {
    const list = this.hooks.get( id ) || [];
    list.push( { handler, priority } );
    this.hooks.set( id, list );

    this.invalidate( id );
  }

  public merge ( hooks: HookImplMap ) : void {
    for ( const [ id, incoming ] of Object.entries( hooks ) as HookEntry ) {
      if ( ! incoming || incoming.length === 0 ) continue;

      const existing = this.hooks.get( id ) ?? [];
      this.hooks.set( id, [ ...existing, ...incoming ] );

      this.invalidate( id );
    }
  }

  public run < K extends HookId > ( id: K, hookCtx: HookCtx< K > ) : void;
  public run < K extends HookId > ( id: K, hookCtx: HookCtx< K >, value: HookValue< K > ) : HookValue< K >;

  public run < K extends HookId > ( id: K, hookCtx: HookCtx< K >, value?: HookValue< K > ) : HookValue< K > {
    Hook.log.debug( `run "${ id }"` );

    try { return this.getPipeline( id )( hookCtx, value ) as HookValue< K > }
    catch ( err ) { throw new HookError( `failed to run hook for "${ id }"`, {
      context: { id, hookCtx, value }, cause: err
    } ) }
  }
}
