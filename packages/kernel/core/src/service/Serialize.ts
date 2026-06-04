import type { ReferenceState } from '@unitra/types/node';
import type { ISerialize } from '@unitra/types/service';
import type { CompoundStruct, UnitStruct } from '@unitra/types/unit';

export class Serialize implements ISerialize {
  constructor () {}

  public fromReference ( state: ReferenceState ) : string {}

  public fromUnitStruct ( struct: UnitStruct | CompoundStruct) : string {}
}
