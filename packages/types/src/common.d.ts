import type { Format, Lang } from '@unitra/dict/common';
import type { PrefixRef } from './prefix';

export type LangGroup< T = unknown > =
  { [ L in Lang ]?: T };

export type FormatGroup< T = unknown > =
  { [ F in Format.PLAIN ]: T } &
  { [ F in Exclude< Format, Format.PLAIN > ]?: T };

export type Modifier = {
  prefix?: PrefixRef;
};
