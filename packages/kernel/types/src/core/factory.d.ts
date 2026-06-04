import type { PrefixRef } from '../def/prefix';

export type UnitModifier = {
  exp?: number;
  prefix?: PrefixRef;
};

export type ConstantModifier = {
  exp?: number;
};

export interface IUnitFactory {}
