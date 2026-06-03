import type { AnyRef, IRegistry, RegistryDef, RegistryKey } from '@unitra/types/registry';
import type { ServicesContext } from '@unitra/types/service';

export class Resolve< Ref extends AnyRef, Like > {
  private get registry () : IRegistry< Ref > {
    return this.ctx.services.registry[ this.key ] as unknown as IRegistry< Ref >;
  }

  constructor (
    private readonly ctx: ServicesContext,
    private readonly key: RegistryKey
  ) {}

  public toRef < R extends Ref = Ref > ( value: Like ) : R {
    this.ctx.services.assert[ this.key ].assertRef( value );
    return value as unknown as R;
  }

  public toDef < R extends Ref = Ref > ( value: Like ) : RegistryDef< R > {
    return this.registry.get( this.toRef( value ) ) as RegistryDef< R >;
  }
}
