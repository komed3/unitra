import type { DefOf, InputOf, RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { IResolve } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { getTypedRegistry } from '../registry';
import { ResolveError } from '../utils';

export class Resolve implements IResolve {
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

  public toRef < K extends RegistryKey > ( key: K, value: InputOf< K > ) : RefOf< K > {
    const res = this.tryToRef( key, value );

    if ( ! res ) throw new ResolveError(
      `cannot resolve reference for ${ key }`,
      { context: { key, value } }
    );

    return res;
  }

  public toDef < K extends RegistryKey > ( key: K, value: InputOf< K > ) : DefOf< K > {
    const res = this.tryToDef( key, value );

    if ( ! res ) throw new ResolveError(
      `cannot resolve definition object for ${ key }`,
      { context: { key, value } }
    );

    return res;
  }
}
