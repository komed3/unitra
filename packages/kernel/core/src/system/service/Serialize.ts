import type { ISerialize } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { CompoundStruct, UnitStruct } from '@unitra/types/def/unit';
import type { NodeMap, ReferenceState, SerializedNode, SerializerMap } from '@unitra/types/node';

export class Serialize implements ISerialize {
  private static readonly map: SerializerMap = {
    unit: ( node ) => ( { order: 2, value: `${ node.prefix ? `${ node.prefix }:` : '' }${ node.unit }^${ node.exp }` } ),
    constant: ( node ) => ( { order: 1, value: `@${ node.constant }^${ node.exp }` } ),
    factor: ( node ) => ( { order: 0, value: `#${ node.value }` } )
  } as const;

  private static serializeNode < K extends keyof NodeMap > ( type: K, node: NodeMap[ K ] ) : SerializedNode {
    return this.map[ type ]( node );
  }

  constructor ( private readonly ctx: UnitraContext ) {}

  public fromReferenceState ( state: ReferenceState ) : string {
    const body = `$${ this.ctx.VERSION }::${
      state.nodes
        .map( ( node ) => Serialize.serializeNode( node.type, node ) )
        .sort( ( a, b ) => a.order - b.order || a.value.localeCompare( b.value ) )
        .map( ( n ) => n.value ).join( '*' )
    }`;

    return this.ctx.core.hook().run( 'core.service.serialize', { state }, body );
  }

  public fromUnitStruct ( struct: UnitStruct | CompoundStruct ) : string {
    return this.fromReferenceState( { nodes: struct.map(
      ( node ) => 'factor' in node ? {
        type: 'factor', value: node.factor
      } : {
        type: 'unit', unit: node.unit, exp: node.exp,
        prefix: 'prefix' in node ? node.prefix : undefined
      }
    ) } );
  }
}
