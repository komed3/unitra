import type { Node, ReferenceState } from '@unitra/types/core/node';
import type { ConstantModifier, UnitModifier } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ConstantInput } from '@unitra/types/def/constant';
import type { UnitInput } from '@unitra/types/def/unit';
import { safeJsonStringify } from '../utils';

export class UnitFactory {
  constructor (
    private readonly ctx: UnitraContext,
    private readonly state: ReferenceState = { nodes: [] }
  ) {}

  private next ( nodes: Node[] = [] ) : UnitFactory {
    return new UnitFactory( this.ctx, { nodes: [ ...this.state.nodes, ...nodes ] } );
  }

  public mul ( value: UnitInput, mod?: UnitModifier ) : UnitFactory {
    const unit = this.ctx.service().resolve().toRef( 'unit', value );
    const prefix = mod?.prefix ? this.ctx.service().resolve().toRef( 'prefix', mod.prefix ) : undefined;

    return this.next( [ { type: 'unit', unit, exp: mod?.exp ?? 1, prefix } ] );
  }

  public div ( unit: UnitInput, mod?: UnitModifier ) : UnitFactory {
    return this.mul( unit, { ...mod, ...{ exp: -( mod?.exp ?? 1 ) } } );
  }

  public constant ( value: ConstantInput, mod?: ConstantModifier ) : UnitFactory {
    const constant = this.ctx.service().resolve().toRef( 'constant', value );

    return this.next( [ { type: 'constant', constant, exp: mod?.exp ?? 1 } ] );
  }

  public factor ( value: number ) : UnitFactory {
    return this.next( [ { type: 'factor', value } ] );
  }

  public toObj () : ReferenceState {
    return this.state;
  }

  public toJSON () : string {
    return safeJsonStringify( this.state );
  }

  public serialize () : string {
    return this.ctx.service().serialize().fromReferenceState( this.state );
  }
}
