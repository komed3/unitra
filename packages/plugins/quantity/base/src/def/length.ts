import { Format, Lang } from '@unitra/dict/common';
import { Branch } from '@unitra/dict/quantity';
import { LengthDim } from '@unitra/dim/base';
import type { DerivedQuantityDef, QuantityRef } from '@unitra/types/quantity';

export const length = 'length' as QuantityRef< typeof LengthDim, 'length' >;

export default ( {
  id: length,
  dim: LengthDim,
  branch: Branch.COMMON,
  meta: {
    symbol: [ {
      id: 'l',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'l',
        [ Format.LATEX ]: 'l'
      }
    }, {
      id: 's',
      context: {
        lang: Lang.DE
      },
      format: {
        [ Format.PLAIN ]: 's',
        [ Format.LATEX ]: 's'
      }
    } ],
    name: {
      [ Lang.EN ]: 'length',
      [ Lang.DE ]: 'Länge'
    },
    description: {
      [ Lang.EN ]: 'quantity expressing the extent of an object or the distance between two points',
      [ Lang.DE ]: 'Größe, die das Ausmaß eines Objekts oder die Entfernung zwischen zwei Punkten ausdrückt'
    }
  }
} ) as const satisfies DerivedQuantityDef< typeof length >;
