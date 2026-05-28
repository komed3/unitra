import type { SIType, System } from '@unitra/dict/common';
import type { UnitStatus, UnitType } from '@unitra/dict/unit';
import type { Meta, Modifier } from './common';
import type { Dimension } from './dim';

export type UnitRef<
  D extends Dimension = Dimension,
  T extends UnitType = UnitType,
  S extends string = string
> = S & {
  readonly __brand: 'unit';
  readonly __type: T;
  readonly __dim: D;
};

export type UnitStruct = ReadonlyArray< {
  unit: UnitRef;
  exp: number;
  modifier?: Modifier;
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

export type UnitConv< D extends Dimension = Dimension > =
  | LinearUnitConv
  | LogUnitConv
  | AffineUnitConv
  | 1;

export type UnitProps = {
  logarithmic?: boolean;
  dimensionless?: boolean;
  constant?: boolean;
};

export type UnitContext = {
  system: ReadonlyArray< System >;
  status?: UnitStatus;
  si?: SIType;
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
  context: UnitContext;
  deprecated?: Deprecated< UnitRef< D > >;
  meta: Meta;
} & ( T extends UnitType.NAMED ? {
  structure: UnitStruct;
  conversion: UnitConv< D >;
  prefixable: boolean;
} : T extends UnitType.COMPOUND ? {
  structure: CompoundStruct;
} : never );

export type DerivedUnitDef< R extends UnitRef > = UnitDef< R[ '__dim' ], R[ '__type' ], R >;

export type UnitLike = UnitRef | UnitDef | string;
