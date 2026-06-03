import type { ConstantDef, ConstantRef } from '@unitra/types/constant';
import type { PrefixDef, PrefixRef } from '@unitra/types/prefix';
import type { QuantityDef, QuantityRef } from '@unitra/types/quantity';
import type { AnyRef, IRegistry, RegistryDef, RegistryKey } from '@unitra/types/registry';
import type { ServicesContext } from '@unitra/types/service';
import type { UnitDef, UnitRef } from '@unitra/types/unit';

export class Resolve< Ref extends AnyRef, Like > {
  private get registry () : IRegistry< Ref > {
    return this.ctx.services.registry[ this.key ] as unknown as IRegistry< Ref >;
  }

  constructor (
    private readonly ctx: ServicesContext,
    private readonly key: RegistryKey
  ) {}

  public toRef < R extends Ref = Ref > ( value: Like ) : R {
    if ( this.ctx.services.assert[ this.key ].isDef( value ) )
      return value.id as unknown as R;

    this.ctx.services.assert[ this.key ].assertRef( value );
    return value as unknown as R;
  }

  public toDef < R extends Ref = Ref > ( value: Like ) : RegistryDef< R > {
    return (
      this.ctx.services.assert[ this.key ].isDef( value ) ? value
        : this.registry.get( this.toRef( value ) )
    ) as RegistryDef< R >;
  }
}

export const createResolveService = ( ctx: ServicesContext ) => ( {
  prefix: new Resolve< PrefixRef, PrefixDef >( ctx, 'prefix' ),
  quantity: new Resolve< QuantityRef, QuantityDef >( ctx, 'quantity' ),
  unit: new Resolve< UnitRef, UnitDef >( ctx, 'unit' ),
  constant: new Resolve< ConstantRef, ConstantDef >( ctx, 'constant' )
} );
