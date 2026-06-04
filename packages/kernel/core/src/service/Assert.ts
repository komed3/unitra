import type { DefOf, RefOf, RegistryKey } from '@unitra/types/registry';
import type { IAssert } from '@unitra/types/service';
import type { UnitraContext } from '@unitra/types/unitra';
import { AssertError } from '@unitra/utils/error';
import { safeJsonStringify } from '@unitra/utils/helper';
import { getTypedRegistry } from '../engine/Registry';

export class Assert implements IAssert {
  constructor ( private readonly ctx: UnitraContext ) {}

  public isRef < K extends RegistryKey > ( key: K, value: unknown ) : value is RefOf< K > {
    return typeof value === 'string' && getTypedRegistry( this.ctx, key ).has( value as RefOf< K > );
  }

  public isDef < K extends RegistryKey > ( key: K, value: unknown ) : value is DefOf< K > {
    return typeof value === 'object' && value !== null && 'id' in value && this.isRef( key, value.id );
  }

  public assertRef < K extends RegistryKey > ( key: K, value: unknown ) : asserts value is RefOf< K > {
    if ( ! this.isRef( key, value ) ) throw new AssertError(
      `expected a ${ key } reference, but got ${ safeJsonStringify( value ) }`,
      { data: { key, value } }
    );
  }

  public assertDef < K extends RegistryKey > ( key: K, value: unknown ) : asserts value is DefOf< K > {
    if ( ! this.isDef( key, value ) ) throw new AssertError(
      `expected a ${ key } definition, but got ${ safeJsonStringify( value ) }`,
      { data: { key, value } }
    );
  }
}
