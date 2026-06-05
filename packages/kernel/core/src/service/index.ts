import type { ServiceAccessor, ServiceContainer, ServiceFactoryMap, ServiceInstanceMap } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Assert } from './Assert';

export const createServiceAccessor = (
  ctx: UnitraContext,
  factories?: Partial< ServiceFactoryMap >
) : ServiceAccessor => {
  const cache: Partial< ServiceInstanceMap > = {};
  const defaults: ServiceFactoryMap = {
    assert: ( ctx ) => new Assert( ctx )
  };

  return () : ServiceContainer => ( {
    assert: () => cache.assert ??= ( factories?.assert ?? defaults.assert )( ctx )
  } );
};

export {
  Assert
};
