import type { DerivedQuantityDef, QuantityRef } from '@unitra/types/quantity';

import { Format, Lang } from '@unitra/dict/common';
import { Branch } from '@unitra/dict/quantity';
import { TemperatureDim } from '@unitra/dim/base';


export const temperature = 'temperature' as QuantityRef< typeof TemperatureDim, 'temperature' >;

export default ( {
  id: temperature,
  dim: TemperatureDim,
  branch: Branch.THERMODYNAMICS,
  meta: {
    symbol: [ {
      id: 'T',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'T',
        [ Format.LATEX ]: 'T'
      }
    } ],
    name: {
      [ Lang.EN ]: 'thermodynamic temperature',
      [ Lang.DE ]: 'Thermodynamische Temperatur'
    },
    description: {
      [ Lang.EN ]: 'quantity expressing the average kinetic energy of the particles in a system',
      [ Lang.DE ]: 'Größe, die die durchschnittliche kinetische Energie der Teilchen in einem System ausdrückt'
    }
  }
} ) as const satisfies DerivedQuantityDef< typeof temperature >;
