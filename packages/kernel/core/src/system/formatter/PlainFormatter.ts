import { Format } from '@unitra/dict/common';
import type { FormatterOptions, IFormatter } from '@unitra/types/core/formatter';
import type { ReferenceState } from '@unitra/types/node';
import { Formatter } from './Formatter';

export class PlainFormatter extends Formatter implements IFormatter {
  protected override readonly format = Format.PLAIN;

  public out ( state: ReferenceState, options?: FormatterOptions ) : string {
    return this.ctx.hook().run( 'core.formatter.format', { state, options }, '' );
  }
}
