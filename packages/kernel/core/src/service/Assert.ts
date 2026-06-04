import type { AnyRef, DefOf, IRegistry, RefOf, RegistryKey } from '@unitra/types/registry';
import type { IAssert } from '@unitra/types/service';
import type { UnitraContext } from '@unitra/types/unitra';
import { AssertError } from '@unitra/utils/error';
import { safeJsonStringify } from '@unitra/utils/helper';

export class Assert implements IAssert {
  constructor ( private readonly ctx: UnitraContext ) {}

  public isRef < K extends RegistryKey, R extends AnyRef = RefOf< K > > ( key: K, value: unknown ) : value is R {
    return typeof value === 'string' && ( this.ctx.registry( key ) as unknown as IRegistry< R > ).has( value as R );
  }

  public isDef < K extends RegistryKey, D = DefOf< K > > ( key: K, value: unknown ) : value is D {
    return typeof value === 'object' && value !== null && 'id' in value && this.isRef( key, value.id );
  }

  public assertRef < K extends RegistryKey, R extends AnyRef = RefOf< K > > ( key: K, value: unknown ) : asserts value is R {
    if ( ! this.isRef( key, value ) ) throw new AssertError(
      `expected a ${ key } reference, but got ${ safeJsonStringify( value ) }`,
      { data: { key, value } }
    );
  }

  public assertDef < K extends RegistryKey, D = DefOf< K > > ( key: K, value: unknown ) : asserts value is D {
    if ( ! this.isDef( key, value ) ) throw new AssertError(
      `expected a ${ key } definition, but got ${ safeJsonStringify( value ) }`,
      { data: { key, value } }
    );
  }
}
