import type { PrefixRef } from '../def/prefix';

export type UnitModifier = {
  exp?: number;
  prefix?: PrefixRef;
};

export type ConstantModifier = {
  exp?: number;
};

export interface IUnitFactory {
  mul: ( value: UnitLike, mod: UnitModifier ) => UnitFactory;
  div: ( unit: UnitLike, mod: UnitModifier ) => UnitFactory;
  constant: ( value: ConstantLike, mod: ConstantModifier ) => UnitFactory;
  factor: ( value: number ) => UnitFactory;
  toObj: () => ReferenceState;
  toJSON: () => string;
  serialize: () => string;
}
