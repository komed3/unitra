import type { ErrorCode } from '@unitra/dict/utils';
import type { ConstantMap } from '../def/constant';
import type { PrefixMap } from '../def/prefix';
import type { QuantityMap } from '../def/quantity';
import type { UnitMap } from '../def/unit';
import type { IUnitraError } from '../utils/error';
import type { SemverRange, SemverVersion } from '../utils/semver';
import type { FactoryFactoryMap } from './factory';
import type { HookImplMap } from './hook';
import type { RegistryFactoryMap } from './registry';
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

export type PluginContributions = {
  prefixes?: ReadonlyArray< PrefixMap >;
  quantities?: ReadonlyArray< QuantityMap >;
  units?: ReadonlyArray< UnitMap >;
  constants?: ReadonlyArray< ConstantMap >;
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
  contributions?: PluginContributions;
  hooks?: HookImplMap;
  overrides?: PluginOverrides;
};

export type PluginList = Readonly< Record< string, SemverVersion[] > >;
export type PluginCatalog = Readonly< Map< string, PluginDefinition[] > >;

export type PluginResolveGraph = Readonly< Map< string, Set< string > > >;

export type PluginResolveResult = {
  plugins: ReadonlyArray< PluginDefinition >;
  graph: PluginResolveGraph;
  error?: IUnitraError< ErrorCode.PLUGIN_ERROR >;
};
