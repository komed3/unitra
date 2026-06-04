import type { DefOf, IRegistry, LikeOf, RefOf, RegistryKey } from '@unitra/types/registry';
import type { IResolve } from '@unitra/types/service';
import type { UnitraContext } from '@unitra/types/unitra';
import { ResolveError } from '@unitra/utils/error';

export class Resolve implements IResolve {
  constructor ( private readonly ctx: UnitraContext ) {}

  public tryToRef < K extends RegistryKey > ( key: K, value: LikeOf< K > ): RefOf< K > | undefined {
    if ( this.ctx.service.assert.isRef( key, value ) ) return value;
    if ( this.ctx.service.assert.isDef( key, value ) ) return value.id;

    return undefined;
  }

  public tryToDef < K extends RegistryKey > ( key: K, value: LikeOf< K > ): DefOf< K > | undefined {
    if ( this.ctx.service.assert.isDef( key, value ) ) return value;
    if ( this.ctx.service.assert.isRef( key, value ) ) return (
      this.ctx.registry( key ) as unknown as IRegistry< RefOf< K > >
    ).get( value );

    return undefined;
  }

  public toRef < K extends RegistryKey > ( key: K, value: LikeOf< K > ) : RefOf< K > {
    const res = this.tryToRef( key, value );
    if ( ! res ) throw new ResolveError< K >(
      `cannot resolve reference for ${ key }`,
      { data: { key, value } }
    );

    return res;
  }

  public toDef < K extends RegistryKey > ( key: K, value: LikeOf< K > ) : DefOf< K > {
    const res = this.tryToDef( key, value );
    if ( ! res ) throw new ResolveError< K >(
      `cannot resolve definition object for ${key}`,
      { data: { key, value } }
    );

    return res;
  }
}
