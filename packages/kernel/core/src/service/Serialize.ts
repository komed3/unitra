import type { NodeMap, SerializedNode, SerializerMap } from '@unitra/types/core/node';
import type { UnitraContext } from '@unitra/types/core/unitra';

export class Serialize {
  private static readonly map: SerializerMap = {
    factor: ( node ) => ( { order: 0, value: `#${ node.value }` } ),
    constant: ( node ) => ( { order: 1, value: `@${ node.constant }^${ node.exp }` } ),
    unit: ( node ) => ( { order: 2, value: `${ node.prefix ? `${ node.prefix }:` : '' }${ node.unit }^${ node.exp }` } )
  } as const;

  private static serializeNode < K extends keyof NodeMap > ( type: K, node: NodeMap[ K ] ) : SerializedNode {
    return this.map[ type ]( node );
  }

  constructor ( private readonly ctx: UnitraContext ) {}
}
