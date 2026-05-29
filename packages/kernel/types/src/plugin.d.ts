import type { DependencyMap, SemverRange } from './manifest';

export type PluginId<
  S extends string = string,
  V extends SemverRange = SemverRange
> = S & {
  //
};

export type PluginDefinition< ID extends PluginId = PluginId > = {
  readonly id: ID;
  dependencies?: DependencyMap;
};
