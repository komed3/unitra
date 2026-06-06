import type { CoreContainer, UnitraContext } from '@unitra/types/core/unitra';
import { createContainer, Logging } from '../utils';
import { Hook } from './Hook';

export const createCoreContainer = ( ctx: UnitraContext ) : CoreContainer =>
  createContainer(
    ctx,
    {
      log: () => Logging.createSource( 'global' ),
      hook: ctx => new Hook( ctx )
    }
  );
