import { Format, Lang } from '@unitra/dict/common';
import type { FormatGroup, LangGroup } from '@unitra/types/common';
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
    return ( group[ format ] ?? group[ Format.PLAIN ] );
  }

  protected pickLang < T > ( group: LangGroup< T >, lang: Lang ) : T {
    return ( group[ lang ] ?? group[ Lang.EN ] ?? Object.values( group )[ 0 ] );
  }
}
