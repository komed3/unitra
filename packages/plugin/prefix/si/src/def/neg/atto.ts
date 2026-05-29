import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/prefix';

export const atto = 'a' as PrefixRef< 'a' >;

export default ( {
  id: atto,
  factor: 1e-18,
  aliases: [
    'atto'
  ],
  meta: {
    symbol: [ {
      id: 'a',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'a',
        [ Format.LATEX ]: '\\mathrm{a}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'atto',
      [ Lang.DE ]: 'Atto'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 1e-18',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 1e-18'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof atto >;
