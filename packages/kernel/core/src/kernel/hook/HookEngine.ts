import type { HookCtx, HookDef, HookHandler, HookId, HookImplMap, HookIn, HookOut, HookPipeline, HookSpec } from '@unitra/types/hook';
import Logging from '@unitra/utils/logging';

export class HookEngine {
  private static readonly log = Logging.createSource( 'hook' );

  private readonly hooks = new Map< HookId, HookDef< any >[] >();
  private readonly cache = new Map< HookId, HookPipeline< any > >();

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

  public merge ( hooks: HookImplMap ) : void {}

  public run < K extends HookId > ( id: K, ctx: HookCtx< K >, input?: HookIn< K > ) : HookOut< K > {
    return undefined as HookOut< K >;
  }
}
