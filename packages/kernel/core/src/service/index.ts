import type { ServiceAccessor, ServiceContainer, ServiceFactoryMap, ServiceInstanceMap } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Assert } from './Assert';
import { Resolve } from './Resolve';
import { Serialize } from './Serialize';

export { Assert, Resolve };

export const createServiceAccessor = (
  ctx: UnitraContext,
  factories?: Partial< ServiceFactoryMap >
) : ServiceAccessor => {
  const cache: Partial< ServiceInstanceMap > = {};

  const defaults: ServiceFactoryMap = {
    assert: ( ctx ) => new Assert( ctx ),
    resolve: ( ctx ) => new Resolve( ctx ),
    serialize: ( ctx ) => new Serialize( ctx )
  };

  const get = < K extends keyof ServiceInstanceMap > ( key: K ) : ServiceInstanceMap[ K ] =>
    cache[ key ] ??= ( factories?.[ key ] ?? defaults[ key ] )( ctx );

  return () : ServiceContainer => ( {
    assert: () => get( 'assert' ),
    resolve: () => get( 'resolve' ),
    serialize: () => get( 'serialize' )
  } );
};
