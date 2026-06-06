import { Format, Lang } from '@unitra/dict/common';
import { Branch } from '@unitra/dict/quantity';
import { AmountOfSubstanceDim } from '@unitra/dim/base';
import type { DerivedQuantityDef, QuantityRef } from '@unitra/types/def/quantity';

export const amountOfSubstance = 'amountOfSubstance' as QuantityRef< typeof AmountOfSubstanceDim, 'amountOfSubstance' >;

export default ( {
  id: amountOfSubstance,
  dim: AmountOfSubstanceDim,
  branch: Branch.COMMON,
  meta: {
    symbol: [ {
      id: 'n',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'n',
        [ Format.LATEX ]: 'n'
      }
    } ],
    name: {
      [ Lang.EN ]: 'amount of substance',
      [ Lang.DE ]: 'Stoffmenge'
    },
    description: {
      [ Lang.EN ]: 'quantity expressing the amount of substance, defined as the number of elementary entities (atoms, molecules, ions, etc.) in a sample',
      [ Lang.DE ]: 'Größe, die die Stoffmenge ausdrückt, definiert als die Anzahl der Elementarteilchen (Atome, Moleküle, Ionen usw.) in einer Probe'
    }
  }
} ) as const satisfies DerivedQuantityDef< typeof amountOfSubstance >;
