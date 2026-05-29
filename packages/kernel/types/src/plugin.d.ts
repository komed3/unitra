export type SemverVersion = `${ number }.${ number }.${ number }${ string }`;
export type SemverOperator = '^' | '~' | '>' | '>=' | '<' | '<=' | '=';
export type SemverRange = `${ SemverOperator }${ SemverVersion }` | `${ SemverVersion }`;

export type DependencyMap = Readonly< Record< string, SemverRange > >;

export type PluginMeta = {
  name: string;
  description?: string;
  tags?: ReadonlyArray< string >;
};

export type PluginDefinition = {
  readonly id: string;
  readonly version: string;
  meta: PluginMeta;
  dependencies?: DependencyMap;
};
