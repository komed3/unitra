import type { FactoryContainer } from './factory';
import type { RegistryContainer } from './registry';
import type { ServiceContainer } from './service';

export type UnitraContext = {
  readonly VERSION: 1;
  registry: RegistryContainer;
  service: ServiceContainer;
  factory: FactoryContainer;
};
