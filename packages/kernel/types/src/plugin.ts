import type { ConstantRegistry, PrefixRegistry, QuantityRegistry, UnitRegistry } from './registry';

export type PluginDefinition = {
  readonly id: string;
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
