import type { AnyRef, RegistryDef } from '@unitra/types/registry';

export abstract class BaseRegistry< Ref extends AnyRef > {
  protected readonly store = new Map< Ref, RegistryDef< Ref > >();
}
