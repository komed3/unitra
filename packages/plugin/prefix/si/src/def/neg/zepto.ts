import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/prefix';

export const zepto = 'z' as PrefixRef< 'z' >;

export default ( {
  id: zepto,
  factor: 1e-21,
  aliases: [ 'zepto' ],
  meta: {
    symbol: [ {
      id: 'z',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'z',
        [ Format.LATEX ]: '\\mathrm{z}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'zepto',
      [ Lang.DE ]: 'Zepto'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 1e-21',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 1e-21'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof zepto >;
