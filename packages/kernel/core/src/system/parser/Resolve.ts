import type { UnitraContext } from '@unitra/types/core/unitra';
import type { Grammar } from './Grammar';

export class Resolve {
  constructor (
    private readonly ctx: UnitraContext,
    private readonly grammar: Grammar
  ) {}
}
