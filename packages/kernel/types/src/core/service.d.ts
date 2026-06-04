import type { AnyRef, DefOf, RefOf, RegistryKey } from './registry';

export interface IAssert {
  isRef: < K extends RegistryKey > ( key: K, value: unknown ) => value is RefOf< K >;
  isDef: < K extends RegistryKey > ( key: K, value: unknown ) => value is DefOf< K >;
  assertRef: < K extends RegistryKey > ( key: K, value: unknown ) => asserts value is RefOf< K >;
  assertDef: < K extends RegistryKey > ( key: K, value: unknown ) => asserts value is DefOf< K >;
}

export interface IResolve {}

export type ServiceContext = {
  assert: IAssert;
  resolve: IResolve;
};
