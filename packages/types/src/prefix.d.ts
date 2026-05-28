export type PrefixRef< S extends string = string > = S & {
  readonly __brand: 'prefix';
};
