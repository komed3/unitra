import { Format } from '@unitra/dict/common';
import type { IFormatter } from '@unitra/types/core/formatter';
import { Formatter } from './Formatter';

export class LaTeXFormatter extends Formatter implements IFormatter {
  protected override readonly format = Format.LATEX;
}
