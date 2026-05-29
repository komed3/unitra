import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/prefix';

export const giga = 'G' as PrefixRef< 'G' >;

export default ( {
  id: giga,
  factor: 1e9,
  aliases: [
    'giga'
  ],
  meta: {
    symbol: [ {
      id: 'G',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'G',
        [ Format.LATEX ]: '\\mathrm{G}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'giga',
      [ Lang.DE ]: 'Giga'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 1e9',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 1e9'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof giga >;
