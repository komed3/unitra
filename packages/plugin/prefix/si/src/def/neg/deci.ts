import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/prefix';

export const deci = 'd' as PrefixRef< 'd' >;

export default ( {
  id: deci,
  factor: 0.1,
  aliases: [ 'deci' ],
  meta: {
    symbol: [ {
      id: 'd',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'd',
        [ Format.LATEX ]: '\\mathrm{d}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'deci',
      [ Lang.DE ]: 'Dezi'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 0.1',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 0.1'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof deci >;
