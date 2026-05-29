import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/prefix';

export const femto = 'f' as PrefixRef< 'f' >;

export default ( {
  id: femto,
  factor: 1e-15,
  aliases: [
    'femto'
  ],
  meta: {
    symbol: [ {
      id: 'f',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'f',
        [ Format.LATEX ]: '\\mathrm{f}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'femto',
      [ Lang.DE ]: 'Femto'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 1e-15',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 1e-15'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof femto >;
