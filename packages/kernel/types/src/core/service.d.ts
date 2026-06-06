import type { CompoundStruct, UnitStruct } from '../def/unit';
import type { ReferenceState } from '../node';
import type { Container, ContainerFactoryMap } from '../utils/container';
import type { DefOf, InputOf, RefOf, RegistryKey } from './registry';

export interface IAssert {
  isRef < K extends RegistryKey > ( key: K, value: unknown ) : value is RefOf< K >;
  isDef < K extends RegistryKey > ( key: K, value: unknown ) : value is DefOf< K >;
  assertRef < K extends RegistryKey > ( key: K, value: unknown ) : asserts value is RefOf< K >;
  assertDef < K extends RegistryKey > ( key: K, value: unknown ) : asserts value is DefOf< K >;
}

export interface IResolve {
  tryToRef < K extends RegistryKey > ( key: K, value: InputOf< K > ) : RefOf< K > | undefined;
  tryToDef < K extends RegistryKey > ( key: K, value: InputOf< K > ) : DefOf< K > | undefined;
  toRef < K extends RegistryKey > ( key: K, value: InputOf< K > ) : RefOf< K >;
  toDef < K extends RegistryKey > ( key: K, value: InputOf< K > ) : DefOf< K >;
}

export interface ISerialize {
  fromReferenceState ( state: ReferenceState ) : string;
  fromUnitStruct ( struct: UnitStruct | CompoundStruct ) : string;
}

export type ServiceInstanceMap = {
  assert: IAssert;
  resolve: IResolve;
  serialize: ISerialize;
};

export type ServiceFactoryMap = ContainerFactoryMap< ServiceInstanceMap >;
export type ServiceContainer = Container< ServiceInstanceMap >;
