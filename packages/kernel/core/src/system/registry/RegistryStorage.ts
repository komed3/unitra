import type { AnyRef, RegistryDef } from '@unitra/types/core/registry';
import { RegistryError } from '../../utils/error';

export class RegistryStorage< Ref extends AnyRef > extends Map< Ref, RegistryDef< Ref > > {
  public override set < R extends Ref > ( key: R, value: RegistryDef< R > ) : this {
    if ( super.has( key ) ) throw new RegistryError(
      `registry already has a definition for reference "${ key }".`,
      { context: { ref: key } }
    );

    return super.set( key, value );
  }

  public override get < R extends Ref > ( key: R ) : RegistryDef< R > | undefined {
    return super.get( key ) as RegistryDef< R > | undefined;
  }
}
