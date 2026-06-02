import type { ConstantMap } from '../def/constant';
import type { PrefixMap } from '../def/prefix';
import type { QuantityMap } from '../def/quantity';
import type { UnitMap } from '../def/unit';
import type { PluginResolutionError } from '../utils/error';
import type { SemverRange, SemverVersion } from '../utils/semver';
import type { HookImplMap } from './hook';

export type DependencyMap = Readonly< Record< string, SemverRange > >;

export type PluginMeta = {
  name: string;
  description?: string;
  tags?: ReadonlyArray< string >;
};

export type PluginContributions = {
  prefixes?: ReadonlyArray< PrefixMap >;
  quantities?: ReadonlyArray< QuantityMap >;
  units?: ReadonlyArray< UnitMap >;
  constants?: ReadonlyArray< ConstantMap >;
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
