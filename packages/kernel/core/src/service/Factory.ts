import type { ReferenceState } from '@unitra/types/node';
import type { UnitraContext } from '@unitra/types/unitra';

export class UnitFactory {
  constructor (
    private readonly ctx: UnitraContext,
    private readonly state: ReferenceState = { nodes: [] }
  ) {}
}
