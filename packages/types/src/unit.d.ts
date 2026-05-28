import type { UnitType } from '@unitra/dict/unit';
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

export type UnitDef<
  D extends Dimension = Dimension,
  T extends UnitType = UnitType,
  R extends UnitRef< D > = UnitRef< D >
> = {
  readonly type: T;
  readonly id: R;
  readonly dim: D;
};

export type DerivedUnitDef< R extends UnitRef > = UnitDef< R[ '__dim' ], R[ '__type' ], R >;

export type UnitLike = UnitRef | UnitDef | string;
