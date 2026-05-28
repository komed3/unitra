import type { System } from '@unitra/dict/common';
import type { UnitStatus, UnitType } from '@unitra/dict/unit';
import type { Modifier } from './common';
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

export type UnitConv< D extends Dimension = Dimension > =
  | { base: UnitRef< D >, factor: number, uncertainty?: number }
  | { base: UnitRef< D >, scale: number, offset: number, uncertainty?: number }
  | 1;

export type UnitContext = {
  system: ReadonlyArray< System >;
  status?: UnitStatus;
  dimensionless?: boolean;
  constant?: boolean;
  si?: SIType;
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
} & ( T extends UnitType.NAMED ? {
  structure: UnitStruct;
  conversion: UnitConv< D >;
  prefixable: boolean;
} : T extends UnitType.COMPOUND ? {
  structure: CompoundStruct;
} : never );

export type DerivedUnitDef< R extends UnitRef > = UnitDef< R[ '__dim' ], R[ '__type' ], R >;

export type UnitLike = UnitRef | UnitDef | string;
