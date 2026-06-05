import { HookDef, HookHandler, HookId, HookPipeline } from '@unitra/types/core/hook';
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
}
