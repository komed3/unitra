import type { AnyRef, IRegistry, RegistryKey } from '@unitra/types/registry';
import type { ServicesContext } from '@unitra/types/service';

export class Resolve< Ref extends AnyRef, Def extends { id: Ref } > {
  private get registry () : IRegistry< Ref > {
    return this.ctx.services.registry[ this.key ] as unknown as IRegistry< Ref >;
  }

  constructor (
    private readonly ctx: ServicesContext,
    private readonly key: RegistryKey
  ) {}
}
