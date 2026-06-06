import type { ConstantInput } from '../def/constant';
import type { PrefixInput } from '../def/prefix';
import type { UnitInput } from '../def/unit';
import type { ReferenceState } from '../node';
import type { UnitraContext } from './unitra';

export type UnitModifier = {
  exp?: number;
  prefix?: PrefixInput;
};

export type ConstantModifier = {
  exp?: number;
};

export interface IUnitFactory {
  mul ( value: UnitInput, mod?: UnitModifier ) : IUnitFactory;
  div ( unit: UnitInput, mod?: UnitModifier ) : IUnitFactory;
  constant ( value: ConstantInput, mod?: ConstantModifier ) : IUnitFactory;
  factor ( value: number ) : IUnitFactory;
  toObj () : ReferenceState;
  toJSON () : string;
  serialize () : string;
}

export type FactoryInstanceMap = {
  unit: IUnitFactory;
};

export type FactoryKey = keyof FactoryInstanceMap;

export type FactoryFactoryMap = {
  [ K in FactoryKey ]:
    ( ctx: UnitraContext ) => FactoryInstanceMap[ K ];
};

export type FactoryContainer = {
  [ K in FactoryKey ]:
    () => FactoryInstanceMap[ K ];
};
