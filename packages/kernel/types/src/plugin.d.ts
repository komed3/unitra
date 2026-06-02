import type { PluginResolutionError } from './error';
import type { HookImplMap } from './hook';
import type { ConstantRegistry, PrefixRegistry, QuantityRegistry, UnitRegistry } from './registry';
import type { SemverRange, SemverVersion } from './semver';

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
  hooks?: HookImplMap;
  overrides?: any;
};

export type PluginList = Readonly< Record< string, SemverVersion[] > >;
export type PluginCatalog = Readonly< Map< string, PluginDefinition[] > >;

export type PluginResolveGraph = Readonly< Map< string, Set< string > > >;

export type PluginResolveResult = {
  plugins: ReadonlyArray< PluginDefinition >;
  graph: PluginResolveGraph;
  error?: PluginResolutionError;
};
