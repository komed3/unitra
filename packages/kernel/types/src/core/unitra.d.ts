import type { FactoryContainer, IUnitFactory } from './factory';
import type { HookAccessor } from './hook';
import type { IRegistry, RefOf, RegistryContainer, RegistryKey } from './registry';
import type { IAssert, IResolve, ISerialize, ServiceContainer } from './service';

export type UnitraContext = {
  readonly VERSION: 1;
  readonly REVISION: number;
  hook: HookAccessor;
  registry: RegistryContainer;
  service: ServiceContainer;
  factory: FactoryContainer;
};

export interface IUnitra {
  readonly version: number;
  readonly root: UnitraContext;
  registry < K extends RegistryKey > ( key: K ) : IRegistry< RefOf< K > >;
  assert () : IAssert;
  resolve () : IResolve;
  serialize () : ISerialize;
  unit () : IUnitFactory;
  clone () : IUnitra;
}
