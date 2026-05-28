import { Format, Lang, SIType, System } from '@unitra/dict/common';
import { UnitStatus, UnitType } from '@unitra/dict/unit';
import { ElectricCurrentDim } from '@unitra/dim/base';
import { electricCurrent } from '@unitra/quantity-base/def/electricCurrent';
import type { DerivedUnitDef, UnitRef } from '@unitra/types/unit';

export const ampere = 'A' as UnitRef< typeof ElectricCurrentDim, UnitType.NAMED, 'A' >;

export default ( {
  type: UnitType.NAMED,
  id: ampere,
  dim: ElectricCurrentDim,
  structure: [],
  conversion: {
    type: 'identity'
  },
  prefixable: true,
  aliases: [
    'ampere',
    'amperes'
  ],
  context: {
    system: [
      System.SI
    ],
    status: UnitStatus.ACTIVE,
    si: SIType.BASE,
    quantities: [
      electricCurrent
    ]
  },
  meta: {
    symbol: [ {
      id: 'A',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'A',
        [ Format.LATEX ]: '\\mathrm{A}'
      }
    } ],
    name: {
      [ Lang.EN ]: [ 'ampere', 'amperes' ],
      [ Lang.DE ]: [ 'Ampere' ]
    },
    description: {
      [ Lang.EN ]: 'SI unit of electric current',
      [ Lang.DE ]: 'SI-Basiseinheit der Stromstärke'
    }
  }
} ) as const satisfies DerivedUnitDef< typeof ampere >;
