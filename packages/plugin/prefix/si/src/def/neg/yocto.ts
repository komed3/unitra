import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/prefix';

export const yocto = 'y' as PrefixRef< 'y' >;

export default ( {
  id: yocto,
  factor: 1e-24,
  aliases: [
    'yocto'
  ],
  meta: {
    symbol: [ {
      id: 'y',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'y',
        [ Format.LATEX ]: '\\mathrm{y}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'yocto',
      [ Lang.DE ]: 'Jokto'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 1e-24',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 1e-24'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof yocto >;
