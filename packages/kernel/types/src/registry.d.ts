import type { ConstantRef, DerivedConstantDef } from './constant';
import type { DerivedPrefixDef, PrefixRef } from './prefix';
import type { DerivedQuantityDef, QuantityRef } from './quantity';
import type { DerivedUnitDef, UnitRef } from './unit';

export type PrefixRegistry = Readonly< { [ R in PrefixRef ]: DerivedPrefixDef< R > } >;
export type QuantityRegistry = Readonly< { [ R in QuantityRef ]: DerivedQuantityDef< R > } >;
export type UnitRegistry = Readonly< { [ R in UnitRef ]: DerivedUnitDef< R > } >;
export type ConstRegistry = Readonly< { [ R in ConstantRef ]: DerivedConstantDef< R > } >;
