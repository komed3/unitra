import { Format, Lang } from '@unitra/dict/common';
import type { DerivedPrefixDef, PrefixRef } from '@unitra/types/prefix';

export const pico = 'p' as PrefixRef< 'p' >;

export default ( {
  id: pico,
  factor: 1e-12,
  aliases: [
    'pico'
  ],
  meta: {
    symbol: [ {
      id: 'p',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'p',
        [ Format.LATEX ]: '\\mathrm{p}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'pico',
      [ Lang.DE ]: 'Piko'
    },
    description: {
      [ Lang.EN ]: 'unit prefix with the factor 1e-12',
      [ Lang.DE ]: 'Einheitenpräfix mit dem Faktor 1e-12'
    }
  }
} ) as const satisfies DerivedPrefixDef< typeof pico >;
