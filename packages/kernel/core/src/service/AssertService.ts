import type { ConstantDef, ConstantRef } from '@unitra/types/constant';
import type { PrefixDef, PrefixRef } from '@unitra/types/prefix';
import type { QuantityDef, QuantityRef } from '@unitra/types/quantity';
import type { IAssert, IAssertService, ServicesContext } from '@unitra/types/service';
import type { UnitDef, UnitRef } from '@unitra/types/unit';

export abstract class Assert< Ref, Def > implements IAssert< Ref, Def > {
  constructor ( private readonly ctx: ServicesContext ) {}

  public isRef ( value: unknown ) : value is Ref {}

  public isDef ( value: unknown ) : value is Def {}

  public assertRef ( value: unknown ) : asserts value is Ref {}

  public assertDef ( value: unknown ) : asserts value is Def {}
}

export class AssertPrefix extends Assert< PrefixRef, PrefixDef > {}
export class AssertQuantity extends Assert< QuantityRef, QuantityDef > {}
export class AssertUnit extends Assert< UnitRef, UnitDef > {}
export class AssertConstant extends Assert< ConstantRef, ConstantDef > {}

export const createRegistryService = ( ctx: ServicesContext ) : IAssertService => ( {
  prefix: new AssertPrefix( ctx ),
  quantity: new AssertQuantity( ctx ),
  unit: new AssertUnit( ctx ),
  constant: new AssertConstant( ctx )
} );
