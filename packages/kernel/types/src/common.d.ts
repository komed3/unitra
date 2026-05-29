import type { Format, Lang, System } from '@unitra/dict/common';

export type LangGroup< T = unknown > = { [ L in Lang ]?: T };

export type FormatGroup< T = unknown > =
  { [ F in Format.PLAIN ]: T } &
  { [ F in Exclude< Format, Format.PLAIN > ]?: T };

export type Symbol = {
  id: string;
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
  symbol: ReadonlyArray< Symbol >;
  formula?: Formula;
  name?: LangGroup< Name >;
  description?: LangGroup< string >;
};

export type Deprecated< R = unknown > = {
  replacement: R;
  since?: string;
  reason?: LangGroup< string >;
};
