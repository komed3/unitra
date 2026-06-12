import { Format, Lang, type System } from '@unitra/dict/common';
import type { FormatGroup, LangGroup, Name, Symbol } from '@unitra/types/common';
import type { IFormatter } from '@unitra/types/core/formatter';
import type { RefOf, RegistryDef, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { getTypedRegistry } from '../registry';

export abstract class Formatter implements IFormatter {
  constructor ( protected readonly ctx: UnitraContext ) {}

  protected get < K extends RegistryKey > ( key: K, ref: RefOf< K > ) : RegistryDef< RefOf< K > > | undefined {
    return getTypedRegistry( this.ctx, key ).get( ref );
  }

  protected pickFormat < T > ( group: FormatGroup< T >, format: Format ) : T {
    return group[ format ] ?? group[ Format.PLAIN ];
  }

  protected pickLang < T > ( group: LangGroup< T > | undefined, lang: Lang ) : T | undefined {
    return group ? group[ lang ] ?? group[ Lang.EN ] ?? Object.values( group )[ 0 ] : undefined;
  }

  protected plural ( text: Name, count: number ) : string {
    return typeof text === 'string' ? text : count === 1 ? text[ 0 ] : text[ 1 ] || text[ 0 ];
  }

  protected pickSymbol ( symbols: readonly Symbol[], opt: { system?: System, lang?: Lang } = {} ) : Symbol | undefined {
    if ( ! symbols.length ) return undefined;

    const filtered = symbols.filter( ( { context } ) => 
      ( ! context?.system || ( opt.system ? context.system.includes( opt.system ) : true ) ) &&
      ( ! context?.lang || ( opt.lang ? context.lang === opt.lang : true ) )
    );

    return filtered.find( s => s.canonical ) ?? filtered[ 0 ] ??
      symbols.find( s => s.canonical ) ?? symbols[ 0 ];
  }
}
