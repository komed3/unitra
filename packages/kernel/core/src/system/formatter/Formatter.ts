import { Format, Lang } from '@unitra/dict/common';
import type { FormatGroup, LangGroup, Name, Symbol } from '@unitra/types/common';
import type { IFormatter, SymbolOptions } from '@unitra/types/core/formatter';
import type { RefOf, RegistryDef, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ReferenceState } from '@unitra/types/node';
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

  protected pickSymbol ( symbols: readonly Symbol[], opt: SymbolOptions = {} ) : Symbol | undefined {
    if ( ! symbols.length ) return undefined;

    const filtered = symbols.filter( ( { id, context } ) =>
      ( opt.id ? opt.id === id : true ) &&
      ( ! context?.system || ( opt.system ? context.system.includes( opt.system ) : true ) ) &&
      ( ! context?.lang || ( opt.lang ? context.lang === opt.lang : true ) )
    );

    return filtered.find( s => s.canonical ) ?? filtered[ 0 ] ??
      symbols.find( s => s.canonical ) ?? symbols[ 0 ];
  }

  public abstract format ( state: ReferenceState ) : string;
}
