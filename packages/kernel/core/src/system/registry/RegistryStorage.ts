import type { AnyRef, RegistryDef } from '@unitra/types/core/registry';

export class RegistryStorage< Ref extends AnyRef > extends Map< Ref, RegistryDef< Ref > > {
  public override set < R extends Ref > ( key: R, value: RegistryDef< R > ) : this {
    return super.set( key, value );
  }

  public override get < R extends Ref > ( key: R ) : RegistryDef< R > | undefined {
    return super.get( key ) as RegistryDef< R > | undefined;
  }
}
