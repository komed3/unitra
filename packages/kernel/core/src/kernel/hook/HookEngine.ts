import type { HookCtx, HookDef, HookHandler, HookId, HookImplMap, HookIn, HookOut, HookPipeline, HookSpec } from '@unitra/types/hook';
import Logging from '@unitra/utils/logging';

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

export class HookEngine {
  private static readonly log = Logging.createSource( 'hook' );

  private readonly hooks = new HookStorage();
  private readonly cache = new HookCache();

  private getPipeline < K extends HookId > ( id: K ) : HookPipeline< K > {
    const cached = this.cache.get( id );
    if ( cached ) return cached;

    const list = ( this.hooks.get( id ) ?? [] );
    const sorted = list.slice().sort( ( a, b ) => ( b.priority ?? 0 ) - ( a.priority ?? 0 ) );

    const pipeline = ( ( ctx, value ) => sorted.reduce( ( v, h ) => h.handler( ctx, v ), value ) ) as HookPipeline< K >;

    this.cache.set( id, pipeline );
    return pipeline;
  }

  constructor () {}

  public invalidate ( id: HookId ) : void {
    this.cache.delete( id );
  }

  public add < K extends HookId > ( id: K, handler: HookHandler< HookSpec< K > >, priority?: number ) : void {
    const list = this.hooks.get( id );
    if ( list ) list.push( { handler, priority } );
    else this.hooks.set( id, [ { handler, priority } ] );

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

  public run < K extends HookId > ( id: K, ctx: HookCtx< K >, input: HookIn< K > ) : HookOut< K > {
    HookEngine.log.debug( `run ${ id }` );

    return ( this.getPipeline( id ) )( ctx, input as any ) as HookOut< K >;
  }
}
