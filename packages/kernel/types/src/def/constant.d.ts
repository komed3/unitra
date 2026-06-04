import type { Deprecated, Meta } from '../common';
import type { Dimension } from '../dim';
import type { UnitStruct } from '../unit';

declare const constantBrand: unique symbol;

type ConstantBrand<
  D extends Dimension,
  S extends string
> = {
  readonly dim: D;
  readonly id: S;
};

export type ConstantRef<
  D extends Dimension = Dimension,
  S extends string = string
> = S & {
  readonly [ constantBrand ]: ConstantBrand< D, S >;
};

export type ConstantDim< R extends ConstantRef > = R[ typeof constantBrand ][ 'dim' ];
export type ConstantId< R extends ContantRef > = R[ typeof constantBrand ][ 'id' ];

export type ConstantDef<
  D extends Dimension = Dimension,
  R extends ConstantRef = ConstantRef
> = {
  id: R;
  dim: D;
  value: number;
  uncertainty?: number;
  structure: UnitStruct;
  aliases?: ReadonlyArray< string >;
  deprecated?: Deprecated< ConstantRef >;
  meta: Meta;
};

export type DerivedConstantDef< R extends ConstantRef > = ConstantDef< ConstantDim< R >, R >;

export type ConstantMap = Readonly< {
  [ R in ConstantRef ]: DerivedConstantDef< R >;
} >;

export type ConstantLike = ConstantRef | ConstantDef;
export type ConstantInput = ConstantLike | string;
