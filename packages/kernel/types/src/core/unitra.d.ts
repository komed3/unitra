import type { RegistryAccessor } from './registry';

export type UnitraContext = {
  readonly VERSION: 1;
  registry: RegistryAccessor;
};
