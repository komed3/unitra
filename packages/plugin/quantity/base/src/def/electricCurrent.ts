import { Format, Lang } from '@unitra/dict/common';
import { Branch } from '@unitra/dict/quantity';
import { ElectricCurrentDim } from '@unitra/dim/base';
import type { DerivedQuantityDef, QuantityRef } from '@unitra/types/def/quantity';

export const electricCurrent = 'electricCurrent' as QuantityRef< typeof ElectricCurrentDim, 'electricCurrent' >;

export default ( {
  id: electricCurrent,
  dim: ElectricCurrentDim,
  branch: Branch.ELECTROMAGNETISM,
  meta: {
    symbol: [ {
      id: 'I',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'I',
        [ Format.LATEX ]: 'I'
      }
    } ],
    name: {
      [ Lang.EN ]: 'electric current',
      [ Lang.DE ]: 'Elektrische Stromstärke'
    },
    description: {
      [ Lang.EN ]: 'quantity expressing the flow of electric charge, defined as the amount of charge passing through a surface per unit time',
      [ Lang.DE ]: 'Größe, die den Fluss von elektrischem Ladung ausdrückt, definiert als die Menge an Ladung, die pro Zeiteinheit durch eine Fläche hindurchgeht'
    }
  }
} ) as const satisfies DerivedQuantityDef< typeof electricCurrent >;
