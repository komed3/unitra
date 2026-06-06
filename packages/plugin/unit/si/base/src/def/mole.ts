import { Format, Lang, SIType, System } from '@unitra/dict/common';
import { UnitStatus, UnitType } from '@unitra/dict/unit';
import { AmountOfSubstanceDim } from '@unitra/dim/base';
import { amountOfSubstance } from '@unitra/plugin-quantity-base/def/amountOfSubstance';
import type { DerivedUnitDef, UnitRef } from '@unitra/types/def/unit';

export const mole = 'mol' as UnitRef< typeof AmountOfSubstanceDim, UnitType.NAMED, 'mol' >;

export default ( {
  type: UnitType.NAMED,
  id: mole,
  dim: AmountOfSubstanceDim,
  structure: [],
  conversion: {
    type: 'identity'
  },
  prefixable: true,
  aliases: [
    'mole',
    'moles'
  ],
  context: {
    system: [
      System.SI
    ],
    status: UnitStatus.ACTIVE,
    si: SIType.BASE,
    quantities: [
      amountOfSubstance
    ]
  },
  meta: {
    symbol: [ {
      id: 'mol',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'mol',
        [ Format.LATEX ]: '\\mathrm{mol}'
      }
    } ],
    name: {
      [ Lang.EN ]: [ 'mole', 'moles' ],
      [ Lang.DE ]: [ 'Mol' ]
    },
    description: {
      [ Lang.EN ]: 'SI unit of amount of substance',
      [ Lang.DE ]: 'SI-Basiseinheit der Stoffmenge'
    }
  }
} ) as const satisfies DerivedUnitDef< typeof mole >;
