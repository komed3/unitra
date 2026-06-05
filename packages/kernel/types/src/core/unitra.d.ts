import type { ILogger } from '../utils/logging';
import type { IHook } from './hook';
import type { RegistryAccessor } from './registry';
import type { ServiceAccessor } from './service';

export type CoreInstanceMap = {
  log: ILogger;
  hook: IHook;
};

export type CoreFactoryMap = {
  [ K in keyof CoreInstanceMap ]: ( ctx: UnitraContext ) => CoreInstanceMap[ K ];
};

export type CoreContainer = {
  [ K in keyof CoreInstanceMap ]: () => CoreInstanceMap[ K ];
};

export type CoreAccessor = () => CoreContainer;

export type UnitraContext = {
  readonly VERSION: 1;
  core: CoreAccessor;
  registry: RegistryAccessor;
  service: ServiceAccessor;
};
