import type { DefOf, RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { IAssert } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ConstantNode, FactorNode, Node, NodeType, ReferenceState, SerializedState, UnitNode } from '@unitra/types/node';
import { AssertError } from '../../utils/error';
import { safeJsonStringify } from '../../utils/json';
import { getTypedRegistry } from '../registry';

const NUM = '\\d+', EXP = '-?\\d+', CHARS = '[A-Za-z0-9_]+';
const PART = `(?:#${ NUM }\\^${ EXP }|@${ CHARS }\\^${ EXP }|${ CHARS }\\^${ EXP }|${ CHARS }:${ CHARS }\\^${ EXP })`;
const SERIALIZED = new RegExp( `^\\$\\d+::${ PART }(?:\\*${ PART })*$` );

export class Assert implements IAssert {
  constructor ( private readonly ctx: UnitraContext ) {}

  public isRef < K extends RegistryKey > ( key: K, value: unknown ) : value is RefOf< K > {
    return typeof value === 'string' && getTypedRegistry( this.ctx, key ).has( value as RefOf< K > );
  }

  public isDef < K extends RegistryKey > ( key: K, value: unknown ) : value is DefOf< K > {
    return typeof value === 'object' && value !== null && 'id' in value && this.isRef( key, value.id );
  }

  public isNode ( value: unknown ) : value is Node;
  public isNode ( value: unknown, type: NodeType | undefined ) : value is Node;
  public isNode ( value: unknown, type: 'unit' ) : value is UnitNode;
  public isNode ( value: unknown, type: 'constant' ) : value is ConstantNode;
  public isNode ( value: unknown, type: 'factor' ) : value is FactorNode;

  public isNode ( value: unknown, type?: NodeType ) : value is Node {
    if ( typeof value !== 'object' || value === null ) return false;
    const node = value as Record< string, unknown >;

    if ( node.type !== ( type ?? node.type ) ) return false;
    if ( typeof node.exp !== 'number' || ! Number.isFinite( node.exp ) || node.exp === 0 ) return false;

    switch ( node.type ) {
      case 'unit':
        return this.isRef( 'unit', node.unit ) && ( ! ( 'prefix' in node ) || this.isRef( 'prefix', node.prefix ) );
      case 'constant':
        return this.isRef( 'constant', node.constant );
      case 'factor':
        return typeof node.value === 'number' && Number.isFinite( node.value );
      default:
        return false;
    }
  }

  public isState ( value: unknown ) : value is ReferenceState {
    return typeof value === 'object' && value !== null && 'nodes' in value &&
      Array.isArray( value.nodes ) && value.nodes.every( node => this.isNode( node ) );
  }

  public isSerializedState ( value: unknown ) : value is SerializedState {
    return typeof value === 'string' && SERIALIZED.test( value );
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

  public assertNode ( value: unknown ) : asserts value is Node;
  public assertNode ( value: unknown, type: NodeType | undefined ) : asserts value is Node;
  public assertNode ( value: unknown, type: 'unit' ) : asserts value is UnitNode;
  public assertNode ( value: unknown, type: 'constant' ) : asserts value is ConstantNode;
  public assertNode ( value: unknown, type: 'factor' ) : asserts value is FactorNode;

  public assertNode ( value: unknown, type?: NodeType ) : asserts value is Node {
    if ( ! this.isNode( value, type ) ) throw new AssertError(
      `expected a ${ type ? `${ type } node` : 'node' }, but got ${ safeJsonStringify( value ) }`,
      { context: { value, type } }
    );
  }

  public assertState ( value: unknown ) : asserts value is ReferenceState {
    if ( ! this.isState( value ) ) throw new AssertError(
      `expected a reference state, but got ${ safeJsonStringify( value ) }`,
      { context: { value } }
    );
  }

  public assertSerializedState ( value: unknown ) : asserts value is SerializedState {
    if ( ! this.isSerializedState( value ) ) throw new AssertError(
      `expected a serialized state, but got ${ safeJsonStringify( value ) }`,
      { context: { value } }
    );
  }
}
