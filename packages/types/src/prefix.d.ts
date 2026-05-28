import type { Deprecated, Meta } from './common';

declare const prefixBrand: unique symbol;

type PrefixBrand = {};

export type PrefixRef< S extends string = string > = S & {
  readonly [ prefixBrand ]: PrefixBrand;
};

export type PrefixDef< R extends PrefixRef = PrefixRef > = {
  readonly id: R;
  factor: number;
  aliases?: ReadonlyArray< string >;
  deprecated?: Deprecated< PrefixRef >;
  meta: Meta;
};

export type DerivedPrefixDef< R extends PrefixRef > = PrefixDef< R >;

export type PrefixLike = PrefixRef | PrefixDef | string;
