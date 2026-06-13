import { Lang } from '@unitra/dict/common';
import type { LangGroup, Name } from '@unitra/types/common';
import type { FormatterOptions, FormatterRenderer, IFormatter, NumberPartRenderer } from '@unitra/types/core/formatter';
import type { RefOf, RegistryKey } from '@unitra/types/core/registry';
import { FormatterError } from '../../utils/error';
import { Formatter } from './Formatter';

export class TextFormatter extends Formatter implements IFormatter {
  private static readonly FIX_UC = /\b(\p{L})(\p{L}*)\b/gu;

  private static readonly DICT = {
    [ Lang.EN ]: {
      frac: 'per',
      power: 'times 10 to the power of',
      exp: 'to the power of',
      squared: 'squared',
      cubed: 'cubed'
    },
    [ Lang.DE ]: {
      frac: 'pro',
      power: 'mal 10 hoch',
      exp: 'to the power of',
      squared: 'zum Quadrat',
      cubed: 'zum Kubik'
    }
  } as const;

  protected resolveLang < T > ( group: LangGroup< T > | undefined, lang?: Lang ) : T | undefined {
    return group ? ( lang && group[ lang ] ) ?? group[ Lang.EN ] ?? Object.values( group )[ 0 ] : undefined;
  }

  protected plural ( text: Name, count: number ) : string {
    return typeof text === 'string' ? text : count === 1 ? text[ 0 ] : text[ 1 ] || text[ 0 ];
  }

  protected override get defaults () : FormatterOptions {
    return {
      ...super.defaults, lang: Lang.EN, fraction: true,
      numeric: { ...super.defaults.numeric, notation: 'standard', scientificStyle: 'power' },
      sep: { ...super.defaults.sep, factor: ' ', exp: ' ', node: ' ' }
    };
  };

  protected override get numberRenderer () : NumberPartRenderer {
    return { ...super.numberRenderer,
      exponentSeparator: ( _, opt ) => ` ${ TextFormatter.DICT[ opt.lang ?? Lang.EN ].power } `
    };
  };

  protected override get renderer () : FormatterRenderer {
    return { ...super.renderer,
      exponent: ( exp, opt ) => {
        const num = this.renderer.number( exp, opt );
        return num === '1' ? '' : ` ${ TextFormatter.DICT[ opt.lang ?? Lang.EN ][
          num === '2' ? 'squared' : num === '3' ? 'cubed' : 'exp'
        ] }${ num !== '2' && num !== '3' ? ` ${ num }` : '' }`;
      },

      fraction: ( num, den, opt ) =>
        den.length ? `${ num } ${ TextFormatter.DICT[ opt.lang ?? Lang.EN ].frac } ${ den }` : num,

      state: ( factor, structure, opt ) =>
        super.renderer.state( factor, structure, opt )
          .replace( TextFormatter.FIX_UC, ( _, first, rest ) => first + rest.toLowerCase() )
    };
  };

  protected override resolveSymbol < K extends RegistryKey > ( key: K, ref: RefOf< K >, opt: FormatterOptions = {} ) : string {
    const meta = this.resolveMeta( key, ref );
    const name = this.resolveLang( meta.name, opt.lang );

    if ( ! name ) throw new FormatterError(
      `no name defined for ${ key } reference "${ ref }"`,
      { context: { key, ref } }
    );

    return this.ctx.hook().run(
      'core.formatter.symbol', { key, ref, meta, options: opt },
      this.plural( name, 1 )
    );
  }
}
