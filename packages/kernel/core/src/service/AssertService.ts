import type { AnyRef, DefOf, IRegistry, RefOf, RegistryKey } from '@unitra/types/registry';
import type { IAssertService } from '@unitra/types/service';
import type { UnitraContext } from '@unitra/types/unitra';
import { AssertDefError, AssertRefError } from '@unitra/utils/error';
import { safeJsonStringify } from '@unitra/utils/helper';

export class AssertService implements IAssertService {
  constructor ( private readonly ctx: UnitraContext ) {}

  public isRef < K extends RegistryKey, R extends AnyRef = RefOf< K > > ( key: K, value: unknown ) : value is R {
    return typeof value === 'string' && ( this.ctx.registry( key ) as unknown as IRegistry< R > ).has( value as R );
  }

  public isDef < K extends RegistryKey, D = DefOf< K > > ( key: K, value: unknown ) : value is D {
    return typeof value === 'object' && value !== null && 'id' in value && this.isRef( key, value.id );
  }

  public assertRef < K extends RegistryKey, R extends AnyRef = RefOf< K > > ( key: K, value: unknown ) : asserts value is R {
    if ( ! this.isRef( key, value ) ) throw new AssertRefError(
      `expected a ${ key } reference, but got ${ safeJsonStringify( value ) }`,
      { data: { key, value } }
    );
  }

  public assertDef < K extends RegistryKey, D = DefOf< K > > ( key: K, value: unknown ) : asserts value is D {
    if ( ! this.isDef( key, value ) ) throw new AssertDefError(
      `expected a ${ key } definition, but got ${ safeJsonStringify( value ) }`,
      { data: { key, value } }
    );
  }
}
