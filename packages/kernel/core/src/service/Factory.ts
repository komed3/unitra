import type { ReferenceState } from '@unitra/types/core/node';
import type { UnitraContext } from '@unitra/types/core/unitra';

export class UnitFactory {
  constructor (
    private readonly ctx: UnitraContext,
    private readonly state: ReferenceState = { nodes: [] }
  ) {}
}
