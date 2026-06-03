import type { ILogger } from '../utils/logging';
import type { IHookEngine } from './hook';
import { RegistryContext } from './registry';

export type CoreContext = {
  hook: IHookEngine;
  log: ILogger;
};

export type UnitraContext = {
  core: CoreContext;
  registry: RegistryContext;
  service: {};
};
