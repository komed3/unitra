import type { AnyRef, IRegistry, RefOf, RegistryKey } from '@unitra/types/registry';
import type { UnitraContext } from '@unitra/types/unitra';

export class AssertService {
  constructor ( private readonly ctx: UnitraContext ) {}

  public isRef < K extends RegistryKey, R extends AnyRef = RefOf< K > > ( key: K, value: unknown ) : value is R {
    return typeof value === 'string' && ( this.ctx.registry( key ) as unknown as IRegistry< R > ).has( value as R );
  }
}
