import type { UnitraContext } from '../core/unitra';

export type ContainerFactoryMap< T > = {
  [ K in keyof T ]:
    ( ctx: UnitraContext ) => T[ K ];
};

export type Container< T > = { [ K in keyof T ]: () => T[ K ] };

export interface CreateContainerOptions {
  cache?: boolean;
}
