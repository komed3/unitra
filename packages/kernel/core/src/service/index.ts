import type { ServiceAccessor, ServiceContainer, ServiceFactoryMap, ServiceInstanceMap } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Assert } from './Assert';
import { Resolve } from './Resolve';

export { Assert, Resolve };

export const createServiceAccessor = (
  ctx: UnitraContext,
  factories?: Partial< ServiceFactoryMap >
) : ServiceAccessor => {
  const cache: Partial< ServiceInstanceMap > = {};
  const defaults: ServiceFactoryMap = {
    assert: ( ctx ) => new Assert( ctx ),
    resolve: ( ctx ) => new Resolve( ctx )
  };

  return () : ServiceContainer => ( {
    assert: () => cache.assert ??= ( factories?.assert ?? defaults.assert )( ctx ),
    resolve: () => cache.resolve ??= ( factories?.resolve ?? defaults.resolve )( ctx )
  } );
};
