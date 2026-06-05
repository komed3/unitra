import type { DefOf, RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { getTypedRegistry } from '../engine/Registry';

export class Assert {
  constructor ( private readonly ctx: UnitraContext ) {}

  public isRef < K extends RegistryKey > ( key: K, value: unknown ) : value is RefOf< K > {
    return typeof value === 'string' && getTypedRegistry( this.ctx, key ).has( value as RefOf< K > );
  }

  public isDef < K extends RegistryKey > ( key: K, value: unknown ) : value is DefOf< K > {
    return typeof value === 'object' && value !== null && 'id' in value && this.isRef( key, value.id );
  }
}
