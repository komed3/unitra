import type { Lang, System } from '@unitra/dict/common';
import type { NodeType, ReferenceState, StructureNode } from '../node';
import type { Container, ContainerFactoryMap } from '../utils/container';
import type { RefOf, RegistryKey } from './registry';

export type SymbolFilter = {
  [ K in RegistryKey ]?: {
    [ R in RefOf< K > ]?: string;
  };
};

export type NumericOptions = {
  precision?: number;
  notation?: Intl.NumberFormatOptions[ 'notation' ];
  sign?: Intl.NumberFormatOptions[ 'signDisplay' ];
  rounding?: Intl.NumberFormatOptions[ 'roundingMode' ];
  grouping?: Intl.NumberFormatOptions[ 'useGrouping' ];
  scientificStyle?: 'e' | 'power';
};

export type FilterOptions = {
  system?: System;
  symbols?: SymbolFilter;
};

export type FormatterOptions = {
  lang?: Lang;
  numeric?: NumericOptions;
  filter?: FilterOptions;
  deprecated?: 'warn' | 'throw' | 'ignore';
  fraction?: boolean;
};

export type GroupedNodes = readonly [
  numerator: StructureNode[],
  denominator: StructureNode[]
];

export type ProcessedNodes = {
  nodes: GroupedNodes;
  factor?: number;
};

export type ResolvedNode = {
  type: Exclude< NodeType, 'factor' >;
  symbol: string;
  exp: number;
  prefix?: string;
};

export type ResolvedNodes = [
  numerator: ResolvedNode[],
  denominator: ResolvedNode[]
];

export interface IFormatter {
  out ( state: ReferenceState, options?: FormatterOptions, value?: number ) : string;
}

export type FormatterType =
  | 'plain'
  | 'unicode'
  | 'latex'
  | 'text';

export type FormatterInstanceMap = { [ F in FormatterType ]: IFormatter };
export type FormatterFactoryMap = ContainerFactoryMap< FormatterInstanceMap >;
export type FormatterContainer = Container< FormatterInstanceMap >;
