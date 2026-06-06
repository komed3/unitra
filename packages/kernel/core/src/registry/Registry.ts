import type { AnyRef, IRegistry } from '@unitra/types/core/registry';
import { RegistryStorage } from './RegistryStorage';

export class Registry< Ref extends AnyRef > implements IRegistry< Ref > {
  private readonly items = new RegistryStorage< Ref >();
}
