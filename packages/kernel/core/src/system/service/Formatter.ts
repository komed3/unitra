import type { IFormatter } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';

export class Formatter implements IFormatter {
  constructor ( private readonly ctx: UnitraContext ) {}
}
