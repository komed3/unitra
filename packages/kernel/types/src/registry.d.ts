import type { ConstantRef, DerivedConstantDef } from './def/constant';
import type { DerivedPrefixDef, PrefixRef } from './def/prefix';
import type { DerivedQuantityDef, QuantityRef } from './def/quantity';
import type { DerivedUnitDef, UnitRef } from './def/unit';

export type PrefixRegistry = Readonly< { [ R in PrefixRef ]: DerivedPrefixDef< R > } >;
export type QuantityRegistry = Readonly< { [ R in QuantityRef ]: DerivedQuantityDef< R > } >;
export type UnitRegistry = Readonly< { [ R in UnitRef ]: DerivedUnitDef< R > } >;
export type ConstantRegistry = Readonly< { [ R in ConstantRef ]: DerivedConstantDef< R > } >;
