import type { ConstantDef, ConstantRef } from '@unitra/types/constant';
import type { PrefixDef, PrefixRef } from '@unitra/types/prefix';
import type { QuantityDef, QuantityRef } from '@unitra/types/quantity';
import type { AnyRef, IRegistry } from '@unitra/types/registry';
import type { IAssert, IAssertService, ServicesContext } from '@unitra/types/service';
import type { UnitDef, UnitRef } from '@unitra/types/unit';

export abstract class Assert< Ref extends AnyRef, Def extends { id: Ref } > implements IAssert< Ref, Def > {
  protected abstract get registry () : IRegistry< Ref >;

  constructor ( protected readonly ctx: ServicesContext ) {}

  public isRef ( value: unknown ) : value is Ref {
    return typeof value === 'string' && this.registry.has( value as Ref );
  }

  public isDef ( value: unknown ) : value is Def {
    return typeof value === 'object' && value !== null && 'id' in value &&
      this.isRef( ( value as Def ).id );
  }

  public assertRef ( value: unknown ) : asserts value is Ref {
    if ( ! this.isRef( value ) ) throw Error();
  }

  public assertDef ( value: unknown ) : asserts value is Def {
    if ( ! this.isDef( value ) ) throw Error();
  }
}

export class AssertPrefix extends Assert< PrefixRef, PrefixDef > {
  protected override get registry () : IRegistry< PrefixRef > {
    return this.ctx.services.registry.prefix;
  }
}

export class AssertQuantity extends Assert< QuantityRef, QuantityDef > {
  protected override get registry () : IRegistry< QuantityRef > {
    return this.ctx.services.registry.quantity;
  }
}

export class AssertUnit extends Assert< UnitRef, UnitDef > {
  protected override get registry () : IRegistry< UnitRef > {
    return this.ctx.services.registry.unit;
  }
}

export class AssertConstant extends Assert< ConstantRef, ConstantDef > {
  protected override get registry () : IRegistry< ConstantRef > {
    return this.ctx.services.registry.constant;
  }
}

export const createAssertService = ( ctx: ServicesContext ) : IAssertService => ( {
  prefix: new AssertPrefix( ctx ),
  quantity: new AssertQuantity( ctx ),
  unit: new AssertUnit( ctx ),
  constant: new AssertConstant( ctx )
} );
