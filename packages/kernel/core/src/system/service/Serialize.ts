import type { IAssert, ISerialize } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { CompoundStruct, UnitStruct } from '@unitra/types/def/unit';
import type { NodeMap, ReferenceState, SerializedNode, SerializedState, SerializerMap } from '@unitra/types/node';
import { VersionError } from '../../utils/error';

export class Serialize implements ISerialize {
  private readonly serializeMap: SerializerMap = {
    unit: ( node ) => ( { order: 2, value: `${ node.prefix ? `${ node.prefix }:` : '' }${ node.unit }^${ node.exp }` } ),
    constant: ( node ) => ( { order: 1, value: `@${ node.constant }^${ node.exp }` } ),
    factor: ( node ) => ( { order: 0, value: `#${ node.value }^${ node.exp }` } )
  } as const;

  private readonly deserializeMap: { [ K in keyof NodeMap ]: ( value: string ) => NodeMap[ K ] } = {
    unit: ( value ) => {
      const [ val, exp ] = value.split( '^', 2 );
      const [ prefix, unit ] = val.split( ':', 2 ).reverse();
      return {
        type: 'unit', exp: Number( exp ) || 1, unit: this.ctx.service.resolve().toRef( 'unit', unit ),
        prefix: prefix ? this.ctx.service.resolve().toRef( 'prefix', prefix ) : undefined
      };
    },
    constant: ( value ) => {
      const [ val, exp ] = value.split( '^', 2 );
      return {
        type: 'constant', exp: Number( exp ) || 1,
        constant: this.ctx.service.resolve().toRef( 'constant', val.slice( 1 ) )
      };
    },
    factor: ( value ) => {
      const [ val, exp ] = value.split( '^', 2 );
      return { type: 'factor', value: Number( val ), exp: Number( exp ) || 1 };
    }
  } as const;

  private serializeNode < K extends keyof NodeMap > ( type: K, node: NodeMap[ K ] ) : SerializedNode {
    return this.serializeMap[ type ]( node );
  }

  constructor ( private readonly ctx: UnitraContext ) {}

  public fromReferenceState ( state: ReferenceState ) : string {
    const assert: IAssert = this.ctx.service.assert();
    assert.assertState( state );

    const body = `$${ this.ctx.VERSION }::${
      state.nodes
        .map( ( node ) => this.serializeNode( node.type, node ) )
        .sort( ( a, b ) => a.order - b.order || a.value.localeCompare( b.value ) )
        .map( ( n ) => n.value ).join( '*' )
    }`;

    return this.ctx.hook().run( 'core.service.serialize', { state }, body );
  }

  public toReferenceState ( input: SerializedState ) : ReferenceState {
    const assert: IAssert = this.ctx.service.assert();
    assert.assertSerializedState( input );

    const state = { nodes: [] };
    const [ version, body ] = input.slice( 1 ).split( '::', 2 );
    const parts = body ? body.split( '*' ) : [];

    if ( Number( version ) !== this.ctx.VERSION ) throw new VersionError(
      `version mismatch: expected ${ this.ctx.VERSION }, got ${ version }`,
      { context: { version: Number( version ) } }
    );

    this.ctx.hook().run( 'core.service.deserialize', { state } );
    return state;
  }

  public fromUnitStruct ( struct: UnitStruct | CompoundStruct ) : string {
    return this.fromReferenceState( { nodes: struct.map(
      ( node ) => 'factor' in node ? {
        type: 'factor', value: node.factor, exp: 1
      } : {
        type: 'unit', unit: node.unit, exp: node.exp,
        prefix: 'prefix' in node ? node.prefix : undefined
      }
    ) } );
  }
}
