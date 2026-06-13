import { Format } from '@unitra/dict/common';
import type { FormatterOptions, FormatterRenderer, IFormatter, NumberPartRenderer } from '@unitra/types/core/formatter';
import { Formatter } from './Formatter';

export class UnicodeFormatter extends Formatter implements IFormatter {
  protected override readonly format = Format.UNICODE;

  protected override get defaults () : FormatterOptions {
    return { ...super.defaults,
      numeric: { ...super.defaults.numeric,
        notation: 'scientific',
        scientificStyle: 'power'
      }
    };
  }

  protected override get numberRenderer () : NumberPartRenderer {
    return { ...super.numberRenderer,
      exponentSeparator: ( part, opt ) => opt.numeric?.scientificStyle === 'power' ? '×10' : part.value,
    };
  }

  protected override get renderer () : FormatterRenderer {
    return { ...super.renderer,
      superscript: value => value.replace( /[0-9+\-]/g, c => ( {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵',
        '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '+': '⁺'
      }[ c ] || c ) ),

      exponent: ( exp, opt ) => this.renderer.superscript(
        super.renderer.exponent( exp, opt ).slice( 1 ), opt
      )
    };
  }
}
