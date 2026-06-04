import type { NodeMap, ReferenceState, SerializedNode, SerializerMap } from '@unitra/types/node';
import type { ISerialize } from '@unitra/types/service';
import type { CompoundStruct, UnitStruct } from '@unitra/types/unit';
import type { UnitraContext } from '@unitra/types/unitra';

export class Serialize implements ISerialize {
  private static readonly map: SerializerMap = {
    factor: ( node ) => ( { order: 0, value: `#${ node.value }` } ),
    constant: (node) => ( { order: 1, value: `@${ node.constant }^${ node.exp }` } ),
    unit: ( node ) => ( { order: 2, value: `${ node.prefix ? `${ node.prefix }:` : '' }${ node.unit }^${ node.exp }` } )
  };

  private static serializeNode < K extends keyof NodeMap > ( type: K, node: NodeMap[ K ] ) : SerializedNode {
    return this.map[ type ]( node );
  }

  constructor ( private readonly ctx: UnitraContext ) {}

  public fromReferenceState ( state: ReferenceState ) : string {
    return this.ctx.core.hook.run( 'core.service.serialize', { state }, `$${ this.ctx.V }::${
      state.nodes
        .map( ( node ) => Serialize.serializeNode( node.type, node ) )
        .sort( ( a, b ) => a.order - b.order || a.value.localeCompare( b.value ) )
        .map( ( n ) => n.value )
        .join( '*' )
    }` );
  }

  public fromUnitStruct ( struct: UnitStruct | CompoundStruct ) : string {
    return this.fromReferenceState( { nodes: struct.map(
      ( node ) => 'factor' in node
        ? { type: 'factor', value: node.factor }
        : {
          type: 'unit', unit: node.unit, exp: node.exp,
          prefix: 'prefix' in node ? node.prefix : undefined
        }
    ) } );
  }
}
