export type SemverVersion = `${ number }.${ number }.${ number }${ string }`;
export type SemverOperator = '^' | '~' | '>' | '>=' | '<' | '<=' | '=';
export type SemverRange = `${ SemverOperator }${ SemverVersion }` | `${ SemverVersion }`;

declare const pluginBrand: unique symbol;

type PluginBrand<
  S extends string,
  V extends SemverRange
> = {
  readonly id: S;
  readonly vers: V;
};

export type PluginRef<
  S extends string = string,
  V extends SemverRange = SemverRange
> = S & {
  readonly [ pluginBrand ]: PluginBrand< S, V >;
};

export type PluginId< R extends PluginRef > = R[ typeof pluginBrand ][ 'id' ];
export type PluginVers< R extends PluginRef > = R[ typeof pluginBrand ][ 'vers' ];
