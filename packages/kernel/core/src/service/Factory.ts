import type { Node, ReferenceState } from '@unitra/types/core/node';
import type { UnitModifier } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { UnitLike } from '@unitra/types/def/unit';

export class UnitFactory {
  constructor (
    private readonly ctx: UnitraContext,
    private readonly state: ReferenceState = { nodes: [] }
  ) {}

  private next ( nodes: Node[] = [] ) : UnitFactory {
    return new UnitFactory( this.ctx, { nodes: [ ...this.state.nodes, ...nodes ] } );
  }

  public mul ( value: UnitLike, mod?: UnitModifier ) : UnitFactory {
    const unit = this.ctx.service().resolve().toRef( 'unit', value );
    const prefix = mod?.prefix ? this.ctx.service().resolve().toRef( 'prefix', mod.prefix ) : undefined;

    return this.next( [ { type: 'unit', unit, exp: mod?.exp ?? 1, prefix } ] );
  }

  public div ( unit: UnitLike, mod: UnitModifier ) : UnitFactory {
    return this.mul( unit, { ...mod, ...{ exp: -( mod.exp ?? 1 ) } } );
  }
}
