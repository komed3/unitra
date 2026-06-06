import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/def/prefix';

export const centi = 'c' as PrefixRef< 'c' >;

export default ( {
  id: centi,
  factor: 0.01,
  aliases: [
    'centi'
  ],
  meta: {
    symbol: [ {
      id: 'c',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'c',
        [ Format.LATEX ]: '\\mathrm{c}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'centi',
      [ Lang.DE ]: 'Zenti'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 0.01',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 0.01'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof centi >;
