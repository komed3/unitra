import type { Container, ContainerFactoryMap } from '../utils/container';
import type { ILogger } from '../utils/logging';
import type { IHook } from './hook';
import type { RegistryContainer } from './registry';
import type { ServiceContainer } from './service';

export type CoreInstanceMap = {
  log: ILogger;
  hook: IHook;
};

export type CoreFactoryMap = ContainerFactoryMap< CoreInstanceMap >;
export type CoreContainer = Container< CoreInstanceMap >;

export type UnitraContext = {
  readonly VERSION: 1;
  core: CoreContainer;
  registry: RegistryContainer;
  service: ServiceContainer;
};
