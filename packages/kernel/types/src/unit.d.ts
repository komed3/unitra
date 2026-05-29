import type { SIType, System } from '@unitra/dict/common';
import type { UnitStatus, UnitType } from '@unitra/dict/unit';
import type { Deprecated, Meta } from './common';
import type { Dimension } from './dim';
import type { PrefixRef } from './prefix';
import type { QuantityRef } from './quantity';

declare const unitBrand: unique symbol;

type UnitBrand<
  D extends Dimension,
  T extends UnitType,
  S extends string
> = {
  readonly type: T;
  readonly dim: D;
  readonly id: S;
};

export type UnitRef<
  D extends Dimension = Dimension,
  T extends UnitType = UnitType,
  S extends string = string
> = S & {
  readonly [ unitBrand ]: UnitBrand< D, T, S >;
};

export type UnitDim< R extends UnitRef > = R[ typeof unitBrand ][ 'dim' ];
export type UnitKind< R extends UnitRef > = R[ typeof unitBrand ][ 'type' ];
export type UnitId< R extends UnitRef > = R[ typeof unitBrand ][ 'id' ];

export type UnitStruct = ReadonlyArray< {
  unit: UnitRef;
  exp: number;
  prefix?: PrefixRef;
} | {
  factor: number;
} >;

export type CompoundStruct = ReadonlyArray< {
  unit: UnitRef;
  exp: number;
} >;

export type LinearUnitConv< D extends Dimension = Dimension > = {
  type: 'linear';
  base: UnitRef< D >;
  factor: number;
  uncertainty?: number;
};

export type LogUnitConv< D extends Dimension = Dimension > = {
  type: 'log';
  base: UnitRef< D >;
  baseValue: number;
  factor: number;
  uncertainty?: number;
};

export type AffineUnitConv< D extends Dimension = Dimension > = {
  type: 'affine';
  base: UnitRef< D >;
  scale: number;
  offset: number;
  uncertainty?: number;
};

export type IdentityUnitConv = {
  type: 'identity';
};

export type UnitConv< D extends Dimension = Dimension > =
  | LinearUnitConv< D >
  | LogUnitConv< D >
  | AffineUnitConv< D >
  | IdentityUnitConv;

export type UnitProps = {
  logarithmic?: boolean;
  dimensionless?: boolean;
  constant?: boolean;
};

export type UnitContext< D extends Dimension = Dimension > = {
  system: ReadonlyArray< System >;
  status?: UnitStatus;
  si?: SIType;
  quantities?: ReadonlyArray< QuantityRef< D > >;
  props?: UnitProps;
};

export type UnitDef<
  D extends Dimension = Dimension,
  T extends UnitType = UnitType,
  R extends UnitRef< D > = UnitRef< D >
> = {
  readonly type: T;
  readonly id: R;
  readonly dim: D;
  aliases?: ReadonlyArray< string >;
  context: UnitContext< D >;
  deprecated?: Deprecated< UnitRef< D > >;
  meta: Meta;
} & ( T extends UnitType.NAMED ? {
  structure: UnitStruct;
  conversion: UnitConv< D >;
  prefixable: boolean;
} : T extends UnitType.COMPOUND ? {
  structure: CompoundStruct;
} : never );

export type DerivedUnitDef< R extends UnitRef > = UnitDef< UnitDim< R >, UnitKind< R >, R >;

export type UnitLike = UnitRef | UnitDef | string;
