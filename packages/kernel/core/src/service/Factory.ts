import type { Node, ReferenceState } from '@unitra/types/core/node';
import type { UnitraContext } from '@unitra/types/core/unitra';

export class UnitFactory {
  constructor (
    private readonly ctx: UnitraContext,
    private readonly state: ReferenceState = { nodes: [] }
  ) {}

  private next ( nodes: Node[] = [] ) : UnitFactory {
    return new UnitFactory( this.ctx, { nodes: [ ...this.state.nodes, ...nodes ] } );
  }
}
