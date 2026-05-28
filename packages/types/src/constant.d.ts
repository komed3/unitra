import type { Deprecated, Meta } from './common';
import type { Dimension } from './dim';
import type { UnitStruct } from './unit';

export type ConstantRef<
  D extends Dimension = Dimension,
  S extends string = string
> = S & {
  readonly __brand: 'constant';
  readonly __dim: D;
};

export type ConstantDef<
  D extends Dimension = Dimension,
  R extends ConstantRef = ConstantRef
> = {
  readonly id: R;
  readonly dim: D;
  value: number;
  uncertainty?: number;
  structure: UnitStruct;
  aliases?: ReadonlyArray< string >;
  deprecated?: Deprecated< ConstantRef >;
  meta: Meta;
};

export type DerivedConstantDef< R extends ConstantRef > = ConstantDef< R[ '__dim' ], R >;

export type ConstantLike = ConstantRef | ConstantDef | string;
