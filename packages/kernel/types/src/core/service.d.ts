import type { CompoundStruct, UnitStruct } from '../def/unit';
import type { ReferenceState } from './node';
import type { DefOf, InputOf, RefOf, RegistryKey } from './registry';
import type { UnitraContext } from './unitra';

export interface IAssert {
  isRef: < K extends RegistryKey > ( key: K, value: unknown ) => value is RefOf< K >;
  isDef: < K extends RegistryKey > ( key: K, value: unknown ) => value is DefOf< K >;
  assertRef: < K extends RegistryKey > ( key: K, value: unknown ) => asserts value is RefOf< K >;
  assertDef: < K extends RegistryKey > ( key: K, value: unknown ) => asserts value is DefOf< K >;
}

export interface IResolve {
  tryToRef: < K extends RegistryKey > ( key: K, value: InputOf< K > ) => RefOf< K > | undefined;
  tryToDef: < K extends RegistryKey > ( key: K, value: InputOf< K > ) => DefOf< K > | undefined;
  toRef: < K extends RegistryKey > ( key: K, value: InputOf< K > ) => RefOf< K >;
  toDef: < K extends RegistryKey > ( key: K, value: InputOf< K > ) => DefOf< K >;
}

export interface ISerialize {
  fromReferenceState: ( state: ReferenceState ) => string;
  fromUnitStruct: ( struct: UnitStruct | CompoundStruct ) => string;
}

export type UnitModifier = {
  exp?: number;
  prefix?: PrefixRef;
};

export type ConstantModifier = {
  exp?: number;
};

export type ServiceInstanceMap = {
  assert: IAssert;
  resolve: IResolve;
  serialize: ISerialize;
};

export type ServiceFactoryMap = {
  [ K in keyof ServiceInstanceMap ]: ( ctx: UnitraContext ) => ServiceInstanceMap[ K ];
};

export type ServiceContainer = {
  [ K in keyof ServiceInstanceMap ]: () => ServiceInstanceMap[ K ];
};

export type ServiceAccessor = () => ServiceContainer;
