import type { ConstantDef, ConstantRef } from '../def/constant';
import type { PrefixDef, PrefixRef } from '../def/prefix';
import type { QuantityDef, QuantityRef } from '../def/quantity';
import type { UnitDef, UnitRef } from '../def/unit';
import type { IHookEngine } from './hook';
import type { AnyRef, IRegistryService } from './registry';

export interface IAssert< Ref extends AnyRef, Def extends { id: Ref } > {
  isRef: ( value: unknown ) => value is Ref;
  isDef: ( value: unknown ) => value is Def;
  assertRef: ( value: unknown ) => asserts value is Ref;
  assertDef: ( value: unknown ) => asserts value is Def;
}

export interface IAssertService {
  prefix: IAssert< PrefixRef, PrefixDef >;
  quantity: IAssert< QuantityRef, QuantityDef >;
  unit: IAssert< UnitRef, UnitDef >;
  constant: IAssert< ConstantRef, ConstantDef >;
}

export type ServicesContext = {
  core: {
    hook: IHookEngine;
  };
  services: {
    registry: IRegistryService;
    assert: IAssertService;
  };
};
