import type { HookAccessor } from '@unitra/types/core/hook';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { createAccessor } from '../../utils/context';
import { HookEngine } from './HookEngine';

export const createHookAccessor = ( ctx: UnitraContext ) : HookAccessor =>
  createAccessor( () => new HookEngine( ctx ) );
