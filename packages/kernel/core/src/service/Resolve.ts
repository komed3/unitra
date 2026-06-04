import type { DefOf, IRegistry, LikeOf, RefOf, RegistryKey } from '@unitra/types/registry';
import type { IResolve } from '@unitra/types/service';
import type { UnitraContext } from '@unitra/types/unitra';
import { ResolveError } from '@unitra/utils/error';

export class Resolve implements IResolve {
  constructor ( private readonly ctx: UnitraContext ) {}

  public tryToRef < K extends RegistryKey, R = RefOf< K > > ( key: K, value: LikeOf< K > ): R | undefined {
    if ( this.ctx.service.assert.isRef( key, value ) ) return value as R;
    if ( this.ctx.service.assert.isDef( key, value ) ) return value.id as R;

    return undefined;
  }

  public tryToDef < K extends RegistryKey, D = DefOf< K > > ( key: K, value: LikeOf< K > ): D | undefined {
    if ( this.ctx.service.assert.isDef( key, value ) ) return value as D;
    if ( this.ctx.service.assert.isRef( key, value ) ) return (
      this.ctx.registry( key ) as unknown as IRegistry< RefOf< K > >
    ).get( value ) as D;

    return undefined;
  }

  public toRef < K extends RegistryKey, R = RefOf< K > > ( key: K, value: LikeOf< K > ) : R {
    const res = this.tryToRef( key, value );
    if ( ! res ) throw new ResolveError< K >(
      `cannot resolve reference for ${ key }`,
      { data: { key, value } }
    );

    return res as R;
  }

  public toDef < K extends RegistryKey, D = DefOf< K > > ( key: K, value: LikeOf< K > ) : D {
    const res = this.tryToDef( key, value );
    if ( ! res ) throw new ResolveError< K >(
      `cannot resolve definition object for ${key}`,
      { data: { key, value } }
    );

    return res as D;
  }
}
