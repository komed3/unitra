import type { AnyRef, IRegistry, RegistryDef } from '@unitra/types/core/registry';

export class Registry< Ref extends AnyRef > implements IRegistry< Ref > {
  protected readonly store = new Map< Ref, RegistryDef< Ref > >();
}
