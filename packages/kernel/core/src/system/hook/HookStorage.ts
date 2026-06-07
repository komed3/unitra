import type { HookDef, HookId } from '@unitra/types/core/hook';

export class HookStorage extends Map {
  public override set < K extends HookId > ( id: K, hooks: HookDef< K >[] ) : this {
    return super.set( id, hooks );
  }

  public override get < K extends HookId > ( id: K ) : HookDef< K >[] | undefined {
    return super.get( id );
  }
}
