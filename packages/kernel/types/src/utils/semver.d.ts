export type SemverVersion = `${ number }.${ number }.${ number }${ string }`;
export type SemverOperator = '^' | '~' | '>' | '>=' | '<' | '<=' | '=';
export type SemverRange = `${ SemverOperator }${ SemverVersion }` | `${ SemverVersion }`;

export type ParsedSemverVersion = readonly [
  major: number,
  minor: number,
  patch: number,
  tag?: string
];

export type ParsedSemverRange = {
  operator: SemverOperator;
  version: ParsedSemverVersion;
};
