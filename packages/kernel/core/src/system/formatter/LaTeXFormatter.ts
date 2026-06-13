import { Format } from '@unitra/dict/common';
import type { FormatterOptions, FormatterRenderer, IFormatter, NumberPartRenderer } from '@unitra/types/core/formatter';
import { Formatter } from './Formatter';

export class LaTeXFormatter extends Formatter implements IFormatter {
  private static readonly EXP_FIX = /\^\{([+-])\}\^\{(\d+)\}/g;
  private static readonly RM_FIX = /^\\mathrm\{([^}]*)\}\\mathrm\{([^}]*)\}/g;

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
    return { ...super.numberRenderer,
      exponentSeparator: ( _, opt ) => opt.numeric?.scientificStyle === 'power' ? '\\,\\cdot\\,10' : '',
    };
  }

  protected override get renderer () : FormatterRenderer {
    return { ...super.renderer,
      superscript: value => `^{${ value }}`,
      number: ( num, opt ) => super.renderer.number( num, opt ).replace( LaTeXFormatter.EXP_FIX, '^{$1$2}' ),

      exponent: ( exp, opt ) => {
        const num = this.renderer.number( exp, opt );
        return num === '1' ? '' : this.renderer.superscript( num, opt )
      },

      node: ( node, opt ) => super.renderer.node( node, opt ).replace( LaTeXFormatter.RM_FIX, '\\mathrm{$1$2}' ),
      numerator: ( nodes, opt ) => nodes.map( n => this.renderer.node( n, opt ) ).join( '\\,' ),
      denominator: ( nodes, opt ) => nodes.map( n => this.renderer.node( n, opt ) ).join( '\\,' ),
      fraction: ( num, den ) => den.length ? `\\frac{${ num }}{${ den }}` : num,

      state: ( factor, structure ) => `{\\displaystyle ${
        factor.length && structure.length ? `${ factor }\\,${ structure }` : factor || structure
      }}`
    };
  }
}
