import { Lang } from '@unitra/dict/common';
import type { LangGroup, Name } from '@unitra/types/common';
import type { FormatterOptions, IFormatter } from '@unitra/types/core/formatter';
import type { RefOf, RegistryKey } from '@unitra/types/core/registry';
import { FormatterError } from '../../utils/error';
import { Formatter } from './Formatter';

export class TextFormatter extends Formatter implements IFormatter {
  protected resolveLang < T > ( group: LangGroup< T > | undefined, lang?: Lang ) : T | undefined {
    return group ? ( lang && group[ lang ] ) ?? group[ Lang.EN ] ?? Object.values( group )[ 0 ] : undefined;
  }

  protected plural ( text: Name, count: number ) : string {
    return typeof text === 'string' ? text : count === 1 ? text[ 0 ] : text[ 1 ] || text[ 0 ];
  }

  protected override get defaults () : FormatterOptions {
    return {
      ...super.defaults,
      numeric: { ...super.defaults.numeric, notation: 'compact', scientificStyle: 'e' },
      sep: { ...super.defaults.sep, factor: ' ', exp: ' times ', node: ' ' }
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
