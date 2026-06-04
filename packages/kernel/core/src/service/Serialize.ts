import type { ReferenceState } from '@unitra/types/node';
import type { ISerialize } from '@unitra/types/service';
import type { CompoundStruct, UnitStruct } from '@unitra/types/unit';

export class Serialize implements ISerialize {
  constructor () {}

  public fromUnitReference ( state: ReferenceState ) : string {}

  public fromUnitStruct ( struct: UnitStruct | CompoundStruct) : string {
    return this.fromUnitReference( { nodes: struct.map(
      ( node ) => 'factor' in node ? {
        type: 'factor',
        value: node.factor
      } : {
        type: 'unit',
        unit: node.unit,
        exp: node.exp,
        modifier: 'modifier' in node ? node.modifier : undefined
      }
    ) } );
  }
}
