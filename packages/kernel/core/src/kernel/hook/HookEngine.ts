import type { HookCache, HookCtx, HookDef, HookHandler, HookId, HookImplMap, HookIn, HookMap, HookOut, HookSpec } from '@unitra/types/hook';
import Logging from '@unitra/utils/logging';

export class HookEngine {
  private static readonly log = Logging.createSource( 'hook' );

  private readonly hooks: HookMap = new Map();
  private readonly cache: HookCache = new Map();

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

  public run < K extends HookId > ( id: K, ctx: HookCtx< K >, input?: HookIn< K > ) : HookOut< K > {
    return undefined as HookOut< K >;
  }
}
