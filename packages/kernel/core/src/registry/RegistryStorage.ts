import type { AnyRef, RegistryDef } from '@unitra/types/core/registry';

export class RegistryStorage< Ref extends AnyRef > extends Map {
  public override set < R extends Ref > ( ref: R, def: RegistryDef< R > ) : this {
    return super.set( ref, def );
  }

  public override get < R extends Ref > ( ref: R ) : RegistryDef< R > | undefined {
    return super.get( ref );
  }
}
