import { Format } from '@unitra/dict/common';
import type { IFormatter } from '@unitra/types/core/formatter';
import type { ReferenceState } from '@unitra/types/node';
import { Formatter } from './Formatter';

export class LatexFormatter extends Formatter implements IFormatter {
  protected override readonly format = Format.LATEX;

  public out ( state: ReferenceState ) : string {
    return '';
  }
}
