import type { ConstantDef, ConstantRef } from '@unitra/types/constant';
import type { PrefixDef, PrefixRef } from '@unitra/types/prefix';
import type { QuantityDef, QuantityRef } from '@unitra/types/quantity';
import type { AnyRef, IRegistry, RegistryKey } from '@unitra/types/registry';
import type { IAssert, IAssertService, ServicesContext } from '@unitra/types/service';
import type { UnitDef, UnitRef } from '@unitra/types/unit';
import { AssertDefError, AssertRefError } from '@unitra/utils/error';
import { safeJsonStringify } from '@unitra/utils/helper';

export class Assert< Ref extends AnyRef, Def extends { id: Ref } > implements IAssert< Ref, Def > {
  private get registry () : IRegistry< Ref > {
    return this.ctx.services.registry[ this.key ] as unknown as IRegistry< Ref >;
  }

  constructor (
    private readonly ctx: ServicesContext,
    private readonly key: RegistryKey
  ) {}

  public isRef ( value: unknown ) : value is Ref {
    return typeof value === 'string' && this.registry.has( value as Ref );
  }

  public isDef ( value: unknown ) : value is Def {
    return typeof value === 'object' && value !== null && 'id' in value &&
      this.isRef( ( value as Def ).id );
  }

  public assertRef ( value: unknown ) : asserts value is Ref {
    if ( ! this.isRef( value ) ) throw new AssertRefError(
      `expected a ${ this.key } reference, but got ${ safeJsonStringify( value ) }`,
      { data: { value } }
    );
  }

  public assertDef ( value: unknown ) : asserts value is Def {
    if ( ! this.isDef( value ) ) throw new AssertDefError(
      `expected a ${ this.key } definition, but got ${ safeJsonStringify( value ) }`,
      { data: { value } }
    );
  }
}

export const createAssertService = ( ctx: ServicesContext ) : IAssertService => ( {
  prefix: new Assert< PrefixRef, PrefixDef >( ctx, 'prefix' ),
  quantity: new Assert< QuantityRef, QuantityDef >( ctx, 'quantity' ),
  unit: new Assert< UnitRef, UnitDef >( ctx, 'unit' ),
  constant: new Assert< ConstantRef, ConstantDef >( ctx, 'constant' )
} );
