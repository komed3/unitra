import type { DefOf, InputOf, RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { getTypedRegistry } from '../engine/Registry';

export class Resolve {
  constructor ( private readonly ctx: UnitraContext ) {}

  public tryToRef < K extends RegistryKey > ( key: K, value: InputOf< K > ) : RefOf< K > | undefined {
    if ( this.ctx.service().assert().isRef( key, value ) ) return value;
    if ( this.ctx.service().assert().isDef( key, value ) ) return value.id;

    return undefined;
  }

  public tryToDef < K extends RegistryKey > ( key: K, value: InputOf< K > ) : DefOf< K > | undefined {
    if ( this.ctx.service().assert().isDef( key, value ) ) return value;
    if ( this.ctx.service().assert().isRef( key, value ) )
      return getTypedRegistry( this.ctx, key ).get( value );

    return undefined;
  }
}
