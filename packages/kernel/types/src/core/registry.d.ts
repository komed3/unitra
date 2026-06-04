import type { ConstantLike, ConstantRef, DerivedConstantDef } from '../def/constant';
import type { DerivedPrefixDef, PrefixLike, PrefixRef } from '../def/prefix';
import type { DerivedQuantityDef, QuantityLike, QuantityRef } from '../def/quantity';
import type { DerivedUnitDef, UnitLike, UnitRef } from '../def/unit';

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

export type RegistryInstanceMap = {
  prefix: IRegistry< PrefixRef >;
  quantity: IRegistry< QuantityRef >;
  unit: IRegistry< UnitRef >;
  constant: IRegistry< ConstantRef >;
};

export type RegistryKey = keyof RegistryInstanceMap;

export type RegistryAccessor = < K extends RegistryKey > ( key: K ) => RegistryInstanceMap[ K ];

export type RegistryMap = {
  prefix: {
    ref: PrefixRef;
    def: DerivedPrefixDef< PrefixRef >;
    like: PrefixLike;
  };
  quantity: {
    ref: QuantityRef;
    def: DerivedQuantityDef< QuantityRef >;
    like: QuantityLike;
  };
  unit: {
    ref: UnitRef;
    def: DerivedUnitDef< UnitRef >;
    like: UnitLike;
  };
  constant: {
    ref: ConstantRef;
    def: DerivedConstantDef< ConstantRef >;
    like: ConstantLike;
  };
};

export type RefOf< K extends RegistryKey > = RegistryMap[ K ][ 'ref' ];
export type DefOf< K extends RegistryKey > = RegistryMap[ K ][ 'def' ];
export type LikeOf< K extends RegistryKey > = RegistryMap[ K ][ 'like' ];
