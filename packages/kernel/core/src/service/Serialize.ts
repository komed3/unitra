import type { ReferenceState } from '@unitra/types/node';
import type { ISerialize } from '@unitra/types/service';
import type { CompoundStruct, UnitStruct } from '@unitra/types/unit';

export class Serialize implements ISerialize {
  constructor () {}

  public fromReferenceState ( state: ReferenceState ) : string {
    return state.nodes
      .map( ( node ) => {
        switch ( node.type ) {
          case 'factor': return { order: 0, value: `#${ node.value }` };
          case 'constant': return { order: 1, value: `@${ node.constant }^${ node.exp }` };
          case 'unit': return { order: 2, value: `${ node.prefix ? `${ node.prefix }:` : '' }${ node.unit }^${ node.exp }` };
        }
      } )
      .sort( ( a, b ) => a.order - b.order || a.value.localeCompare( b.value ) )
      .map( ( node ) => node.value )
      .join( '*' );
  }

  public fromUnitStruct ( struct: UnitStruct | CompoundStruct) : string {
    return this.fromReferenceState( { nodes: struct.map(
      ( node ) => 'factor' in node ? {
        type: 'factor', value: node.factor
      } : {
        type: 'unit', unit: node.unit, exp: node.exp,
        modifier: 'modifier' in node ? node.modifier : undefined
      }
    ) } );
  }
}
