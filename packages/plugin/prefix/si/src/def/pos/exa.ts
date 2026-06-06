import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/def/prefix';

export const exa = 'E' as PrefixRef< 'E' >;

export default ( {
  id: exa,
  factor: 1e18,
  aliases: [
    'exa'
  ],
  meta: {
    symbol: [ {
      id: 'E',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'E',
        [ Format.LATEX ]: '\\mathrm{E}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'exa',
      [ Lang.DE ]: 'Exa'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 1e18',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 1e18'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof exa >;
