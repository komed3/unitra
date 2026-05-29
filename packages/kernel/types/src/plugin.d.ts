export type SemverVersion = `${ number }.${ number }.${ number }${ string }`;
export type SemverOperator = '^' | '~' | '>' | '>=' | '<' | '<=' | '=';
export type SemverRange = `${ SemverOperator }${ SemverVersion }` | `${ SemverVersion }`;

export type DependencyMap = Readonly< Record< string, SemverRange > >;

export type PluginDefinition = {
  readonly id: string;
  readonly version: string;
  dependencies?: DependencyMap;
};
