import type { HookAccessor, IHookEngine } from '@unitra/types/core/hook';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { HookEngine } from './HookEngine';

export const createHookAccessor = ( ctx: UnitraContext ) : HookAccessor => {
  let instance: IHookEngine;
  return () => instance ??= new HookEngine( ctx );
}
