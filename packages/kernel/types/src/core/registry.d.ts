import type { ConstantRef, DerivedConstantDef } from '../def/constant';
import type { DerivedPrefixDef, PrefixRef } from '../def/prefix';
import type { DerivedQuantityDef, QuantityRef } from '../def/quantity';
import type { DerivedUnitDef, UnitRef } from '../def/unit';

export type AnyRef =
  | PrefixRef
  | QuantityRef
  | UnitRef
  | ConstantRef;

export type RegistryDef< R extends AnyRef > =
  R extends PrefixRef ? DerivedPrefixDef< R > :
  R extends QuantityRef ? DerivedQuantityDef< R > :
  R extends UnitRef ? DerivedUnitDef< R > :
  R extends ConstantRef ? DerivedConstantDef< R > :
  never;
