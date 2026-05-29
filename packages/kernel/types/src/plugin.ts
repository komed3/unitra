import type { ConstantRegistry, PrefixRegistry, QuantityRegistry, UnitRegistry } from './registry';

export type PluginMeta = {
  name: string;
  description?: string;
  tags?: ReadonlyArray< string >;
};

export type PluginDefinition = {
  readonly id: string;
  readonly version: string;
  meta: PluginMeta;
  install?: ( ctx: any ) => void;
  dependencies?: ReadonlyArray< string >;
  contributes?: {
    prefixes?: ReadonlyArray< PrefixRegistry >;
    quantities?: ReadonlyArray< QuantityRegistry >;
    units?: ReadonlyArray< UnitRegistry >;
    constants?: ReadonlyArray< ConstantRegistry >;
    modules?: ReadonlyArray< any >;
  };
  hooks?: Partial< any >;
  overrides?: Partial< any >;
};
