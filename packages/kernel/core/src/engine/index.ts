import type { CoreAccessor, CoreContainer, CoreFactoryMap, CoreInstanceMap, UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../utils';
import { Hook } from './Hook';

export const createCoreAccessor = ( ctx: UnitraContext ) : CoreAccessor => {
  const cache: Partial< CoreInstanceMap > = {};

  const defaults: CoreFactoryMap = {
    log: () => Logging.createSource( 'global' ),
    hook: ( ctx ) => new Hook( ctx )
  };

  const get = < K extends keyof CoreInstanceMap > ( key: K ) : CoreInstanceMap[ K ] =>
    cache[ key ] ??= defaults[ key ]( ctx );

  return () : CoreContainer => ( {
    log: () => get( 'log' ),
    hook: () => get( 'hook' )
  } );
};
