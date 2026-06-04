import type { IUnitFactory, UnitFactoryModifier } from '@unitra/types/factory';
import type { ReferenceState } from '@unitra/types/node';
import type { UnitLike } from '@unitra/types/unit';
import type { UnitraContext } from '@unitra/types/unitra';

export class UnitFactory implements IUnitFactory {
  constructor (
    private readonly ctx: UnitraContext,
    private readonly state: ReferenceState = { nodes: [] }
  ) {}

  public mul ( value: UnitLike, mod: UnitFactoryModifier ) : UnitFactory {
    const unit = this.ctx.service.resolve.toRef( 'unit', value );
    const prefix = mod.prefix && this.ctx.service.resolve.toRef( 'prefix', mod.prefix );

    return new UnitFactory( this.ctx, { nodes: [ ...this.state.nodes, {
      type: 'unit', unit, exp: mod.exp ?? 1, prefix
    } ] } );
  }

  public div ( unit: UnitLike, mod: UnitFactoryModifier ) : UnitFactory {
    return this.mul( unit, { ...mod, ...{ exp: -( mod.exp ?? 1 ) } } );
  }
}
