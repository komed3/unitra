import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/prefix';

export const ronna = 'R' as PrefixRef< 'R' >;

export default ( {
  id: ronna,
  factor: 1e27,
  aliases: [ 'ronna' ],
  meta: {
    symbol: [ {
      id: 'R',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'R',
        [ Format.LATEX ]: '\\mathrm{R}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'ronna',
      [ Lang.DE ]: 'Ronna'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 1e27',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 1e27'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof ronna >;
