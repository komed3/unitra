import type { ErrorCode } from '@unitra/dict/utils';
import type { IUnitraError } from '../utils/error';
import type { SemverRange, SemverVersion } from '../utils/semver';
import type { FactoryFactoryMap } from './factory';
import type { HookImplMap } from './hook';
import type { MapOf, RegistryFactoryMap, RegistryKey } from './registry';
import type { ServiceFactoryMap } from './service';

export type DependencyMap = Readonly< Record< string, SemverRange > >;

export type PluginMeta = {
  name: string;
  description?: string;
  tags?: ReadonlyArray< string >;
  license?: string;
  author?: string;
  repo?: string;
  homepage?: string;
};

export type PluginContribs = {
  [ K in RegistryKey ]?:
    ReadonlyArray< MapOf< K > >;
};

export type PluginOverrides = {
  factory?: Partial< FactoryFactoryMap >;
  registry?: Partial< RegistryFactoryMap >;
  service?: Partial< ServiceFactoryMap >;
};

export type PluginDefinition = {
  readonly id: string;
  readonly version: SemverVersion;
  meta: PluginMeta;
  dependencies?: DependencyMap;
  contribs?: PluginContribs;
  hooks?: HookImplMap;
  overrides?: PluginOverrides;
};

export type PluginList = Readonly< Record< string, SemverVersion[] > >;
export type PluginCatalog = Readonly< Map< string, PluginDefinition[] > >;

export type PluginResolveGraph = Readonly< Map< string, Set< string > > >;

export type PluginRequirements = Map< string, Array< {
  plugin: PluginDefinition;
  range: SemverRange;
} > >;

export type PluginResolveResult = {
  readonly revId: number;
  plugins: ReadonlyArray< PluginDefinition >;
  graph: PluginResolveGraph;
  error?: IUnitraError< ErrorCode.PLUGIN_RESOLVE_ERROR >;
};
