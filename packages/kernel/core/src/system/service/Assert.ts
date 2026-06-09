import type { DefOf, RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { IAssert } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { Node, ReferenceState } from '@unitra/types/node';
import { AssertError } from '../../utils/error';
import { safeJsonStringify } from '../../utils/json';
import { getTypedRegistry } from '../registry';

export class Assert implements IAssert {
  constructor ( private readonly ctx: UnitraContext ) {}

  public isRef < K extends RegistryKey > ( key: K, value: unknown ) : value is RefOf< K > {
    return typeof value === 'string' && getTypedRegistry( this.ctx, key ).has( value as RefOf< K > );
  }

  public isDef < K extends RegistryKey > ( key: K, value: unknown ) : value is DefOf< K > {
    return typeof value === 'object' && value !== null && 'id' in value && this.isRef( key, value.id );
  }

  public isNode ( value: unknown ) : value is Node {
    return true;
  }

  public isState ( value: unknown ) : value is ReferenceState {
    return typeof value === 'object' && value !== null && 'nodes' in value &&
      ( value as ReferenceState ).nodes.every( node => this.isNode( node ) );
  }

  public assertRef < K extends RegistryKey > ( key: K, value: unknown ) : asserts value is RefOf< K > {
    if ( ! this.isRef( key, value ) ) throw new AssertError(
      `expected a ${ key } reference, but got ${ safeJsonStringify( value ) }`,
      { context: { key, value } }
    );
  }

  public assertDef < K extends RegistryKey > ( key: K, value: unknown ) : asserts value is DefOf< K > {
    if ( ! this.isDef( key, value ) ) throw new AssertError(
      `expected a ${ key } definition, but got ${ safeJsonStringify( value ) }`,
      { context: { key, value } }
    );
  }
}
