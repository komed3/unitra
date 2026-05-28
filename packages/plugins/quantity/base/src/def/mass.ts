import type { DerivedQuantityDef, QuantityRef } from '@unitra/types/quantity';

import { Format, Lang } from '@unitra/dict/common';
import { Branch } from '@unitra/dict/quantity';
import { MassDim } from '@unitra/dim/base';


export const mass = 'mass' as QuantityRef< typeof MassDim, 'mass' >;

export default ( {
  id: mass,
  dim: MassDim,
  branch: Branch.COMMON,
  meta: {
    symbol: [ {
      id: 'm',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'm',
        [ Format.LATEX ]: 'm'
      }
    } ],
    name: {
      [ Lang.EN ]: 'mass',
      [ Lang.DE ]: 'Masse'
    },
    description: {
      [ Lang.EN ]: 'quantity expressing the amount of matter in a physical body',
      [ Lang.DE ]: 'Größe, die die Menge an Materie in einem physischen Körper ausdrückt'
    }
  }
} ) as const satisfies DerivedQuantityDef< typeof mass >;
