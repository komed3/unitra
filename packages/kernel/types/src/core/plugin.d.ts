import type { ConstantMap } from '../def/constant';
import type { PrefixMap } from '../def/prefix';
import type { QuantityMap } from '../def/quantity';
import type { UnitMap } from '../def/unit';
import type { SemverRange } from '../utils/semver';

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
