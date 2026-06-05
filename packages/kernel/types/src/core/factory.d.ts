import type { ConstantInput } from '../def/constant';
import type { PrefixInput } from '../def/prefix';
import type { UnitInput } from '../def/unit';
import type { ReferenceState } from './node';

export type UnitModifier = {
  exp?: number;
  prefix?: PrefixInput;
};

export type ConstantModifier = {
  exp?: number;
};

export interface IUnitFactory {
  mul: ( value: UnitInput, mod: UnitModifier ) => UnitFactory;
  div: ( unit: UnitInput, mod: UnitModifier ) => UnitFactory;
  constant: ( value: ConstantInput, mod: ConstantModifier ) => UnitFactory;
  factor: ( value: number ) => UnitFactory;
  toObj: () => ReferenceState;
  toJSON: () => string;
  serialize: () => string;
}
