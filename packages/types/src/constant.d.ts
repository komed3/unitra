import type { Deprecated, Meta } from './common';
import type { Dimension } from './dim';
import type { UnitStruct } from './unit';

declare const constantBrand: unique symbol;

type ConstantBrand< D extends Dimension > = {
  readonly dim: D;
};

export type ConstantRef<
  D extends Dimension = Dimension,
  S extends string = string
> = S & {
  readonly [ constantBrand ]: ConstantBrand< D >;
};

export type ConstantDim< R extends ConstantRef > = R[ typeof constantBrand ][ 'dim' ];

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

export type DerivedConstantDef< R extends ConstantRef > = ConstantDef< ConstantDim< R >, R >;

export type ConstantLike = ConstantRef | ConstantDef | string;
