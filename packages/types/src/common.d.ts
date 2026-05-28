import type { Format, Lang, System } from '@unitra/dict/common';
import type { PrefixRef } from './prefix';

export type LangGroup< T = unknown > =
  { [ L in Lang ]?: T };

export type FormatGroup< T = unknown > =
  { [ F in Format.PLAIN ]: T } &
  { [ F in Exclude< Format, Format.PLAIN > ]?: T };

export type Modifier = {
  prefix?: PrefixRef;
};

export type Symbol = {
  readonly id: string;
  canonical?: boolean;
  deprecated?: boolean;
  context?: {
    system?: ReadonlyArray< System >;
    lang?: Lang;
  };
  format: FormatGroup< string >;
};

export type Formula = {
  format: FormatGroup< string >;
};

export type Name = string | readonly [
  singular: string,
  plural?: string
];

export type Meta = {
  symbol: Symbol[];
  formula?: Formula;
  name?: LangGroup< Name >;
  description?: LangGroup< string >;
};
