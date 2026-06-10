import type { ReferenceState } from '../node';
import type { FactoryContainer, IUnitFactory } from './factory';
import type { HookAccessor } from './hook';
import type { ParserAccessor, ParserResult } from './parser';
import type { IRegistry, RefOf, RegistryContainer, RegistryKey } from './registry';
import type { IAssert, IResolve, ServiceContainer } from './service';

export type UnitraContext = {
  readonly VERSION: 1;
  readonly REVISION: number;
  hook: HookAccessor;
  registry: RegistryContainer;
  service: ServiceContainer;
  parser: ParserAccessor;
  factory: FactoryContainer;
};

export interface IUnitra {
  readonly version: number;
  readonly root: UnitraContext;
  registry < K extends RegistryKey > ( key: K ) : IRegistry< RefOf< K > >;
  assert () : IAssert;
  resolve () : IResolve;
  serialize ( input: ReferenceState ) : string;
  parse ( input: unknown ) : ParserResult;
  unit () : IUnitFactory;
  clone () : IUnitra;
}
