import type { ConstantInput, ConstantLike, ConstantMap, ConstantRef, DerivedConstantDef } from '../def/constant';
import type { DerivedPrefixDef, PrefixInput, PrefixLike, PrefixMap, PrefixRef } from '../def/prefix';
import type { DerivedQuantityDef, QuantityInput, QuantityLike, QuantityMap, QuantityRef } from '../def/quantity';
import type { DerivedUnitDef, UnitInput, UnitLike, UnitMap, UnitRef } from '../def/unit';
import type { Container, ContainerFactoryMap } from '../utils/container';

export type AnyRef =
  | PrefixRef
  | QuantityRef
  | UnitRef
  | ConstantRef;

export type RegistryDef< R extends AnyRef > =
  R extends PrefixRef
    ? DerivedPrefixDef< R >
    : R extends QuantityRef
      ? DerivedQuantityDef< R >
      : R extends UnitRef
        ? DerivedUnitDef< R >
        : R extends ConstantRef
          ? DerivedConstantDef< R >
          : never;

export type RegistryMap = {
  prefix: {
    ref: PrefixRef;
    def: DerivedPrefixDef< PrefixRef >;
    like: PrefixLike;
    input: PrefixInput;
    map: PrefixMap;
  };
  quantity: {
    ref: QuantityRef;
    def: DerivedQuantityDef< QuantityRef >;
    like: QuantityLike;
    input: QuantityInput;
    map: QuantityMap;
  };
  unit: {
    ref: UnitRef;
    def: DerivedUnitDef< UnitRef >;
    like: UnitLike;
    input: UnitInput;
    map: UnitMap;
  };
  constant: {
    ref: ConstantRef;
    def: DerivedConstantDef< ConstantRef >;
    like: ConstantLike;
    input: ConstantInput;
    map: ConstantMap;
  };
};

export type RegistryKey = keyof RegistryMap;

export type RefOf< K extends RegistryKey > = RegistryMap[ K ][ 'ref' ];
export type DefOf< K extends RegistryKey > = RegistryMap[ K ][ 'def' ];
export type LikeOf< K extends RegistryKey > = RegistryMap[ K ][ 'like' ];
export type InputOf< K extends RegistryKey > = RegistryMap[ K ][ 'input' ];
export type MapOf< K extends RegistryKey > = RegistryMap[ K ][ 'map' ];

export type RegistryContent< Ref extends AnyRef > = Readonly< Record< Ref, RegistryDef< Ref > > >;
export type RegistryEntries< Ref extends AnyRef > = Iterable< [ Ref, RegistryDef< Ref > ] >;

export interface IRegistry< Ref extends AnyRef > {
  readonly size: number;
  get < R extends Ref > ( ref: R ) : RegistryDef< R > | undefined;
  has ( ref: Ref ) : boolean;
  set < R extends Ref > ( ref: R, def: RegistryDef< R > ) : void;
  bulk ( input: RegistryContent< Ref > | RegistryEntries< Ref > ) : void;
  entries () : IterableIterator< [ Ref, RegistryDef< Ref > ] >;
  values () : IterableIterator< RegistryDef< Ref > >;
  keys () : IterableIterator< Ref >;
  filter ( predicate: ( def: RegistryDef< Ref > ) => boolean ) : RegistryDef< Ref >[];
}

export type RegistryInstanceMap = {
  [ K in RegistryKey ]:
    IRegistry< RefOf< K > >
};

export type RegistryFactoryMap = ContainerFactoryMap< RegistryInstanceMap >;
export type RegistryContainer = Container< RegistryInstanceMap >;
