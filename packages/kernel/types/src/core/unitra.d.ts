import type { FactoryContainer } from './factory';
import type { HookAccessor } from './hook';
import type { RegistryContainer } from './registry';
import type { ServiceContainer } from './service';

export type UnitraContext = {
  readonly VERSION: 1;
  hook: HookAccessor;
  registry: RegistryContainer;
  service: ServiceContainer;
  factory: FactoryContainer;
};
