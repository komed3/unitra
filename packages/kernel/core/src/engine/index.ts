import type { CoreContainer, CoreFactoryMap, CoreInstanceMap, UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../utils';
import { Hook } from './Hook';

export const createCoreContainer = ( ctx: UnitraContext ) : CoreContainer => {
  const cache: Partial< CoreInstanceMap > = {};

  const defaults: CoreFactoryMap = {
    log: () => Logging.createSource( 'global' ),
    hook: ( ctx ) => new Hook( ctx )
  };

  const get = < K extends keyof CoreInstanceMap > ( key: K ) : CoreInstanceMap[ K ] =>
    cache[ key ] ??= defaults[ key ]( ctx );

  return Object.freeze( {
    log: () => get( 'log' ),
    hook: () => get( 'hook' )
  } );
};
