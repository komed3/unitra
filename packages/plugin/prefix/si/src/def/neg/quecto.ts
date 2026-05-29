import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/prefix';

export const quecto = 'q' as PrefixRef< 'q' >;

export default ( {
  id: quecto,
  factor: 1e-30,
  aliases: [ 'quecto' ],
  meta: {
    symbol: [ {
      id: 'q',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'q',
        [ Format.LATEX ]: '\\mathrm{q}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'quecto',
      [ Lang.DE ]: 'Quekto'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 1e-30',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 1e-30'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof quecto >;
