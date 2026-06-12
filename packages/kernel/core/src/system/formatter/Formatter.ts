import type { IFormatter } from '@unitra/types/core/formatter';
import type { UnitraContext } from '@unitra/types/core/unitra';

export abstract class Formatter implements IFormatter {
  constructor ( protected readonly ctx: UnitraContext ) {}
}
