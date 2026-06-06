import type { UnitraContext } from '@unitra/types/core/unitra';
import type { Container, ContainerFactoryMap, CreateContainerOptions } from '@unitra/types/utils/container';

export const createContainer = < T extends Record< PropertyKey, unknown > > (
  ctx: UnitraContext,
  defaults: ContainerFactoryMap< T >,
  overrides?: Partial< ContainerFactoryMap< T > >,
  options: CreateContainerOptions = {
    cache: true
  }
) : Container< T > => {
  const instances: Partial< T > = {};

  const create = < K extends keyof T > ( key: K ) : T[ K ] => {
    const factory = overrides?.[ key ] ?? defaults[ key ];

    if ( ! options.cache ) return factory( ctx );
    return instances[ key ] ??= factory( ctx );
  };

  return Object.freeze( Object.fromEntries( Object.keys( defaults ).map(
    key => [ key, () => create( key as keyof T ) ]
  ) ) as Container< T > );
};
