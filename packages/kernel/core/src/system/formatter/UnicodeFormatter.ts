import { Format } from '@unitra/dict/common';
import type { FormatterOptions, FormatterRenderer, IFormatter, NumberPartRenderer } from '@unitra/types/core/formatter';
import { Formatter } from './Formatter';

export class UnicodeFormatter extends Formatter implements IFormatter {
  private static readonly DIGITS = /[0-9+\-]/g;
  private static readonly SUPER_MAP = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵',
    '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻'
  } as const;

  protected override readonly format = Format.UNICODE;

  protected override get defaults () : FormatterOptions {
    return {
      ...super.defaults,
      numeric: { ...super.defaults.numeric, notation: 'scientific', scientificStyle: 'power' },
      sep: { ...super.defaults.sep, factor: ' ', exp: '×', node: ' ' }
    };
  }

  protected override get numberRenderer () : NumberPartRenderer {
    return { ...super.numberRenderer,
      exponentSeparator: ( part, opt ) =>
        opt.numeric?.scientificStyle === 'power' ? `${ opt.sep?.exp }10` : part.value
    };
  }

  protected override get renderer () : FormatterRenderer {
    return { ...super.renderer,
      superscript: value => value.replace(
        UnicodeFormatter.DIGITS, c => c in UnicodeFormatter.SUPER_MAP
          ? UnicodeFormatter.SUPER_MAP[ c as keyof typeof UnicodeFormatter.SUPER_MAP ]
          : c
      ),

      exponent: ( exp, opt ) => {
        const num = this.renderer.number( exp, opt );
        return num === '1' ? '' : this.renderer.superscript( num, opt );
      }
    };
  }
}
