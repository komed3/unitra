import type { ServiceContainer, ServiceFactoryMap } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { createContainer } from '../../utils/context';
import { Assert } from './Assert';
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
      resolve: ctx => new Resolve( ctx ),
      serialize: ctx => new Serialize( ctx )
    },
    factories
  );
