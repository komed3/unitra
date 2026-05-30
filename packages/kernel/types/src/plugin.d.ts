import type { ConstantRegistry, PrefixRegistry, QuantityRegistry, UnitRegistry } from './registry';

export type SemverVersion = `${ number }.${ number }.${ number }${ string }`;
export type SemverOperator = '^' | '~' | '>' | '>=' | '<' | '<=' | '=';
export type SemverRange = `${ SemverOperator }${ SemverVersion }` | `${ SemverVersion }`;

export type ParsedSemverVersion = {
  major: number;
  minor: number;
  patch: number;
};

export type DependencyMap = Readonly< Record< string, SemverRange > >;

export type PluginMeta = {
  name: string;
  description?: string;
  tags?: ReadonlyArray< string >;
};

export type PluginContributions = {
  prefixes?: ReadonlyArray< PrefixRegistry >;
  quantities?: ReadonlyArray< QuantityRegistry >;
  units?: ReadonlyArray< UnitRegistry >;
  constants?: ReadonlyArray< ConstantRegistry >;
};

export type PluginDefinition = {
  readonly id: string;
  readonly version: SemverVersion;
  meta: PluginMeta;
  dependencies?: DependencyMap;
  install?: ( ctx: any ) => void;
  contributions?: PluginContributions;
  modules?: any;
  hooks?: any;
  overrides?: any;
};

export type PluginList = Readonly< Record< string, ReadonlyArray< SemverVersion > > >;
export type PluginCatalog = Map< string, ReadonlyArray< PluginDefinition > >;

export type PluginResolveError = {
  message: string;
  missing: string[];
  conflicts: string[];
  cycles: string[];
};

export type PluginResolveResult = {
  plugins: ReadonlyArray< PluginDefinition >;
  error?: PluginResolveError;
};
