import type { AnyRef, IRegistry, RefOf, RegistryKey } from '@unitra/types/registry';
import type { UnitraContext } from '@unitra/types/unitra';
import { AssertRefError } from '@unitra/utils/error';
import { safeJsonStringify } from '@unitra/utils/helper';

export class AssertService {
  constructor ( private readonly ctx: UnitraContext ) {}

  public isRef < K extends RegistryKey, R extends AnyRef = RefOf< K > > ( key: K, value: unknown ) : value is R {
    return typeof value === 'string' && ( this.ctx.registry( key ) as unknown as IRegistry< R > ).has( value as R );
  }

  public assertRef < K extends RegistryKey, R extends AnyRef = RefOf< K > > ( key: K, value: unknown ) : asserts value is R {
    if ( ! this.isRef( key, value ) ) throw new AssertRefError(
      `expected a ${ key } reference, but got ${ safeJsonStringify( value ) }`,
      { data: { key, value } }
    );
  }
}
