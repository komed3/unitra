import type { ILogger } from '../utils/logging';
import type { FactoryService } from './factory';
import type { IHookEngine } from './hook';
import type { RegistryAccessor } from './registry';
import type { ServiceContext } from './service';

export type CoreContext = {
  hook: IHookEngine;
  log: ILogger;
};

export type UnitraContext = {
  core: CoreContext;
  factory: FactoryService;
  registry: RegistryAccessor;
  service: ServiceContext;
};
