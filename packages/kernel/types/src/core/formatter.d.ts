import type { Lang, System } from '@unitra/dict/common';
import type { ReferenceState } from '../node';
import type { RefOf, RegistryKey } from './registry';

export type SymbolFilter = {
  [ K in RegistryKey ]?: {
    [ R in RefOf< K > ]?: string;
  };
};

export type NumericOptions = {
  format?: Intl.NumberFormatOptions[ 'notation' ];
  precision?: number;
};

export type FilterOptions = {
  system?: System;
  lang?: Lang;
  symbols?: SymbolFilter;
};

export type FormatterOptions = {
  numeric?: NumericOptions;
  filter?: FilterOptions;
  deprecated?: 'warn' | 'throw' | 'ignore';
  fraction?: boolean;
};

export interface IFormatter {
  out ( state: ReferenceState, options?: FormatterOptions ) : string;
}
