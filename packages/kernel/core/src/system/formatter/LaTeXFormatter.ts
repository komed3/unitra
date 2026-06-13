import { Format } from '@unitra/dict/common';
import type { FormatterOptions, FormatterRenderer, IFormatter, NumberPartRenderer } from '@unitra/types/core/formatter';
import { Formatter } from './Formatter';

export class LaTeXFormatter extends Formatter implements IFormatter {
  protected override readonly format = Format.LATEX;

  protected override get defaults () : FormatterOptions {
    return { ...super.defaults,
      numeric: { ...super.defaults.numeric,
        notation: 'scientific',
        scientificStyle: 'power'
      }
    };
  }

  protected override get numberRenderer () : NumberPartRenderer {
    return { ...super.numberRenderer };
  }

  protected override get renderer () : FormatterRenderer {
    return { ...super.renderer };
  }
}
