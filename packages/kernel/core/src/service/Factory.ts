import type { ConstantLike } from '@unitra/types/constant';
import type { ConstantModifier, IUnitFactory, UnitModifier } from '@unitra/types/factory';
import type { ReferenceState } from '@unitra/types/node';
import type { UnitLike } from '@unitra/types/unit';
import type { UnitraContext } from '@unitra/types/unitra';
import { safeJsonStringify } from '@unitra/utils/helper';

export class UnitFactory implements IUnitFactory {
  constructor (
    private readonly ctx: UnitraContext,
    private readonly state: ReferenceState = { nodes: [] }
  ) {}

  public mul ( value: UnitLike, mod: UnitModifier ) : UnitFactory {
    const unit = this.ctx.service.resolve.toRef( 'unit', value );
    const prefix = mod.prefix && this.ctx.service.resolve.toRef( 'prefix', mod.prefix );

    return new UnitFactory( this.ctx, { nodes: [ ...this.state.nodes, {
      type: 'unit', unit, exp: mod.exp ?? 1, prefix
    } ] } );
  }

  public div ( unit: UnitLike, mod: UnitModifier ) : UnitFactory {
    return this.mul( unit, { ...mod, ...{ exp: -( mod.exp ?? 1 ) } } );
  }

  public constant ( value: ConstantLike, mod: ConstantModifier ) : UnitFactory {
    const constant = this.ctx.service.resolve.toRef( 'constant', value );

    return new UnitFactory( this.ctx, { nodes: [ ...this.state.nodes, {
      type: 'constant', constant, exp: mod.exp ?? 1
    } ] } );
  }

  public factor ( value: number ) : UnitFactory {
    return new UnitFactory( this.ctx, { nodes: [ ...this.state.nodes, {
      type: 'factor', value
    } ] } );
  }

  public toObj () : ReferenceState {
    return this.state;
  }

  public toJSON () : string {
    return safeJsonStringify( this.state );
  }

  public serialize () : string {
    return this.ctx.service.serialize.fromReferenceState( this.state );
  }
}
