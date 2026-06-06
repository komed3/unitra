import type { ServiceContainer, ServiceFactoryMap, ServiceInstanceMap, ServiceKey } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Assert } from './Assert';
import { Resolve } from './Resolve';
import { Serialize } from './Serialize';

export { Assert, Resolve };

export const createServiceContainer = (
  ctx: UnitraContext,
  factories?: Partial< ServiceFactoryMap >
) : ServiceContainer => {
  const cache: Partial< ServiceInstanceMap > = {};

  const defaults: ServiceFactoryMap = {
    assert: ( ctx ) => new Assert( ctx ),
    resolve: ( ctx ) => new Resolve( ctx ),
    serialize: ( ctx ) => new Serialize( ctx )
  };

  const get = < K extends ServiceKey > ( key: K ) : ServiceInstanceMap[ K ] =>
    cache[ key ] ??= ( factories?.[ key ] ?? defaults[ key ] )( ctx );

  return Object.freeze( {
    assert: () => get( 'assert' ),
    resolve: () => get( 'resolve' ),
    serialize: () => get( 'serialize' )
  } );
};
