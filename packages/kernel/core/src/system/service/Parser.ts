import type { UnitraContext } from '@unitra/types/core/unitra';
import { UnitRef } from '@unitra/types/def/unit';
import { safeJsonStringify } from '../../utils/json';

export class Parser {
  private readonly cache: any;

  private populateCache () : void {
    const units = new Map< string, UnitRef >();
    for ( const unit of this.ctx.registry.unit().values() ) {
      units.set( unit.id, unit.id );
      for ( const alias of unit.aliases ?? [] ) units.set( alias, unit.id );
    }
    console.log( safeJsonStringify( units ) );
  }

  constructor ( private readonly ctx: UnitraContext ) {}

  public test () {
    this.populateCache();
  }
}
