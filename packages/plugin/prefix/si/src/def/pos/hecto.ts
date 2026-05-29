import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/prefix';

export const hecto = 'h' as PrefixRef< 'h' >;

export default ( {
  id: hecto,
  factor: 100,
  aliases: [
    'hecto'
  ],
  meta: {
    symbol: [ {
      id: 'h',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'h',
        [ Format.LATEX ]: '\\mathrm{h}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'hecto',
      [ Lang.DE ]: 'Hekto'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 100',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 100'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof hecto >;
