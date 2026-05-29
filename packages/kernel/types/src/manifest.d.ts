export type SemverOperator = '^' | '~' | '>' | '>=' | '<' | '<=' | '=';

export type SemverVersion = `${ number }.${ number }.${ number }${ string }`;

export type SemverRange =
  | `${ SemverOperator }${ SemverVersion }`
  | `${ SemverVersion }`;
