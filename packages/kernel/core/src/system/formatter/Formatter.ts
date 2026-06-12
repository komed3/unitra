import type { IFormatter } from '@unitra/types/core/formatter';
import type { UnitraContext } from '@unitra/types/core/unitra';

export abstract class Formatter implements IFormatter {
  constructor ( private readonly ctx: UnitraContext ) {}
}
