import type { HookId, HookPipeline } from '@unitra/types/core/hook';

class HookCache extends Map {
  public override set < K extends HookId > ( id: K, fn: HookPipeline< K > ) : this {
    return super.set( id, fn );
  }

  public override get < K extends HookId > ( id: K ) : HookPipeline< K > | undefined {
    return super.get( id );
  }
}
