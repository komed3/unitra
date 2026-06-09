import type { ServiceContainer, ServiceFactoryMap } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { createContainer } from '../../utils/context';
import { Assert } from './Assert';
import { Formatter } from './Formatter';
import { Parser } from './Parser';
import { Resolve } from './Resolve';
import { Serialize } from './Serialize';

export const createServiceContainer = (
  ctx: UnitraContext,
  factories?: Partial< ServiceFactoryMap >
) : ServiceContainer =>
  createContainer(
    ctx,
    {
      assert: ctx => new Assert( ctx ),
      formatter: ctx => new Formatter( ctx ),
      parser: ctx => new Parser( ctx ),
      resolve: ctx => new Resolve( ctx ),
      serialize: ctx => new Serialize( ctx )
    },
    factories
  );
