import type { ServiceContext } from '@unitra/types/service';
import type { UnitraContext } from '@unitra/types/unitra';
import { Assert } from './Assert';
import { Resolve } from './Resolve';
import { Serialize } from './Serialize';

export const createServices = ( ctx: UnitraContext, overrides?: Partial< ServiceContext > ) : ServiceContext => ( {
  assert: overrides?.assert ?? new Assert( ctx ),
  resolve: overrides?.resolve ?? new Resolve( ctx ),
  serialize: overrides?.serialize ?? new Serialize( ctx )
} );
