import type { Deprecated, Meta } from '../common';

declare const prefixBrand: unique symbol;

type PrefixBrand< S extends string > = {
  readonly id: S;
};

export type PrefixRef< S extends string = string > = S & {
  readonly [ prefixBrand ]: PrefixBrand< S >;
};

export type PrefixId< R extends PrefixRef > = R[ typeof prefixBrand ][ 'id' ];

export type PrefixDef< R extends PrefixRef = PrefixRef > = {
  id: R;
  factor: number;
  aliases?: ReadonlyArray< string >;
  deprecated?: Deprecated< PrefixRef >;
  meta: Meta;
};

export type DerivedPrefixDef< R extends PrefixRef > = PrefixDef< R >;

export type PrefixMap = Readonly< { [ R in PrefixRef ]: DerivedPrefixDef< R > } >;

export type PrefixLike = PrefixRef | PrefixDef | string;
