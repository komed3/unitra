import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/def/prefix';

export const deca = 'da' as PrefixRef< 'da' >;

export default ( {
  id: deca,
  factor: 10,
  aliases: [
    'deca'
  ],
  meta: {
    symbol: [ {
      id: 'da',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'da',
        [ Format.LATEX ]: '\\mathrm{da}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'deca',
      [ Lang.DE ]: 'Deka'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 10',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 10'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof deca >;
