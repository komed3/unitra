import type { IFormatter } from '@unitra/types/core/formatter';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ReferenceState } from '@unitra/types/node';

export abstract class Formatter implements IFormatter {
  constructor ( protected readonly ctx: UnitraContext ) {}

  public abstract format ( state: ReferenceState ) : string;
}
