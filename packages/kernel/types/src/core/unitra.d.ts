import type { FactoryContainer } from './factory';
import type { HookAccessor } from './hook';
import type { RegistryContainer } from './registry';
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
  assert () : IAssert;
  resolve () : IResolve;
  serialize () : ISerialize;
  clone () : IUnitra;
}
