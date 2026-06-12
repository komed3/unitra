import type { Lang, System } from '@unitra/dict/common';
import type { NodeType, ReferenceState } from '../node';
import type { RefOf, RegistryKey } from './registry';

export type SymbolIDFilter = {
  [ K in RegistryKey ]?: {
    [ R in RefOf< K > ]?: string;
  };
};

export type NumericOptions = {
  format?: 'decimal' | 'scientific' | 'engineering' | 'compact';
  precision?: number;
};

export type FilterOptions = {
  system?: System;
  lang?: Lang;
  symbols?: SymbolIDFilter;
};

export type FormatterOptions = {
  numeric?: NumericOptions;
  filter?: FilterOptions;
  deprecated?: 'warn' | 'throw' | 'ignore';
  fraction?: boolean;
};

export type FormatterNode = {
  type: NodeType;
  symbol: string;
  exp: number;
  value?: number;
  prefix?: string;
};

export interface IFormatter {
  out ( state: ReferenceState, options?: FormatterOptions ) : string;
}
