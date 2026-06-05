import type { RegistryAccessor } from './registry';
import type { ServiceAccessor } from './service';

export type UnitraContext = {
  readonly VERSION: 1;
  registry: RegistryAccessor;
  service: ServiceAccessor;
};
