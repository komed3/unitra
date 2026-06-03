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

export interface IRegistry< Ref extends AnyRef > {
  readonly size: number;
  get: < R extends Ref > ( ref: R ) => RegistryDef< R > | undefined;
  has: < R extends Ref > ( ref: R ) => boolean;
  set: < R extends Ref > ( ref: R, def: RegistryDef< R > ) => void;
  bulk: ( input: Iterable< [ Ref, RegistryDef< Ref > ] > ) => void;
  entries: () => IterableIterator< [ Ref, RegistryDef< Ref > ] >;
  values: () => IterableIterator< RegistryDef< Ref > >;
  keys: () => IterableIterator< Ref >;
  filter: ( predicate: ( def: RegistryDef< Ref > ) => boolean ) => RegistryDef< Ref >[];
}

export type RegistryMap = {
  prefix: IRegistry< PrefixRef >;
  quantity: IRegistry< QuantityRef >;
  unit: IRegistry< UnitRef >;
  constant: IRegistry< ConstantRef >;
};

export type RegistryKey = keyof RegistryMap;

export type RegistryAccessor = < K extends RegistryKey > ( key: K ) => RegistryMap[ K ];

export type RefMap = {
  prefix: PrefixRef;
  quantity: QuantityRef;
  unit: UnitRef;
  constant: ConstantRef;
};

export type DefMap = {
  prefix: DerivedPrefixDef< PrefixRef >;
  quantity: DerivedQuantityDef< QuantityRef >;
  unit: DerivedUnitDef< UnitRef >;
  constant: DerivedConstantDef< ConstantRef >;
};

export type RefOf< K extends RegistryKey > = RefMap[ K ];
export type DefOf< K extends RegistryKey > = DefMap[ K ];
