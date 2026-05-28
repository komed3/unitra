import type { DerivedQuantityDef, QuantityRef } from '@unitra/types/quantity';

import { Format, Lang } from '@unitra/dict/common';
import { Branch } from '@unitra/dict/quantity';
import { LuminousIntensityDim } from '@unitra/dim/base';


export const luminousIntensity = 'luminousIntensity' as QuantityRef< typeof LuminousIntensityDim, 'luminousIntensity' >;

export default ( {
  id: luminousIntensity,
  dim: LuminousIntensityDim,
  branch: Branch.COMMON,
  meta: {
    symbol: [ {
      id: 'Iv',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'Iv',
        [ Format.LATEX ]: 'I_{\\mathrm{v}}'
      }
    } ],
    name: {
      [ Lang.EN ]: 'luminous intensity',
      [ Lang.DE ]: 'Lichtstärke'
    },
    description: {
      [ Lang.EN ]: 'quantity expressing the amount of light emitted by a source in a particular direction, measured in candelas',
      [ Lang.DE ]: 'Größe, die die Menge an Licht ausdrückt, die von einer Quelle in eine bestimmte Richtung emittiert wird, gemessen in Candela'
    }
  }
} ) as const satisfies DerivedQuantityDef< typeof luminousIntensity >;
