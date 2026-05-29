import type { Branch } from '@unitra/dict/quantity';
import type { Deprecated, Meta } from './common';
import type { Dimension } from './dim';

declare const quantityBrand: unique symbol;

type QuantityBrand<
  D extends Dimension,
  S extends string
> = {
  readonly dim: D;
  readonly id: S;
};

export type QuantityRef<
  D extends Dimension = Dimension,
  S extends string = string
> = S & {
  readonly [ quantityBrand ]: QuantityBrand< D, S >;
};

export type QuantityDim< R extends QuantityRef > = R[ typeof quantityBrand ][ 'dim' ];
export type QuantityId< R extends QuantityRef > = R[ typeof quantityBrand ][ 'id' ];

export type QuantityDef<
  D extends Dimension = Dimension,
  R extends QuantityRef< D > = QuantityRef< D >
> = {
  readonly id: R;
  readonly dim: D;
  branch?: Branch;
  deprecated?: Deprecated< QuantityRef< D > >;
  meta: Meta;
};

export type DerivedQuantityDef< R extends QuantityRef > = QuantityDef< QuantityDim< R >, R >;

export type QuantityLike = QuantityRef | QuantityDef | string;
