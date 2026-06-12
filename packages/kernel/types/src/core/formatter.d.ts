import type { Lang, System } from '@unitra/dict/common';
import type { ReferenceState } from '../node';
import type { RefOf, RegistryKey } from './registry';

export type SymbolIDFilter = {
  [ K in RegistryKey ]?: {
    [ R in RefOf< K > ]?: string;
  };
};

export type SymbolOptions = {
  system?: System;
  lang?: Lang;
  id?: string;
};

export type FormatterOptions = {
  fraction?: boolean;
  deprecated?: 'warn' | 'throw' | 'ignore';
  numeric?: {
    format?: 'decimal' | 'scientific' | 'engineering' | 'compact';
    precision?: number;
  };
  filter?: {
    system?: System;
    lang?: Lang;
    symbols?: SymbolIDFilter;
  };
};

export interface IFormatter {
  format ( state: ReferenceState, options?: FormatterOptions ) : string;
}
