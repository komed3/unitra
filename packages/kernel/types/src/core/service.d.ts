import type { AnyRef, DefOf, RefOf, RegistryKey } from './registry';

export interface IAssertService {
  isRef: < K extends RegistryKey, R extends AnyRef = RefOf< K > > ( key: K, value: unknown ) => value is R;
  isDef: < K extends RegistryKey, D = DefOf< K > > ( key: K, value: unknown ) => value is D;
  assertRef: < K extends RegistryKey, R extends AnyRef = RefOf< K > > ( key: K, value: unknown ) => asserts value is R;
  assertDef: < K extends RegistryKey, D = DefOf< K > > ( key: K, value: unknown ) => asserts value is D;
}
