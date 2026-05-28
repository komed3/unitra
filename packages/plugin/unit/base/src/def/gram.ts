import { Format, Lang, SIType, System } from '@unitra/dict/common';
import { UnitStatus, UnitType } from '@unitra/dict/unit';
import { MassDim } from '@unitra/dim/base';
import { mass } from '@unitra/quantity-base/def/mass';
import type { DerivedUnitDef, UnitRef } from '@unitra/types/unit';

export const gram = 'g' as UnitRef< typeof MassDim, UnitType.NAMED, 'g' >;

export default ( {
  type: UnitType.NAMED,
  id: gram,
  dim: MassDim,
  structure: [],
  conversion: {
    type: 'identity'
  },
  prefixable: true,
  aliases: [
    'gram',
    'grams'
  ],
  context: {
    system: [
      System.SI
    ],
    status: UnitStatus.ACTIVE,
    si: SIType.BASE,
    quantities: [
      mass
    ]
  },
  meta: {
    symbol: [ {
      id: 'g',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'g',
        [ Format.LATEX ]: '\\mathrm{g}'
      }
    } ],
    name: {
      [ Lang.EN ]: [ 'gram', 'grams' ],
      [ Lang.DE ]: [ 'Gramm' ]
    },
    description: {
      [ Lang.EN ]: 'common unit of mass, used as reference unit; the actual SI base unit is the kilogram',
      [ Lang.DE ]: 'gebräuchliche Masseeinheit, die als Referenz verwendet wird; die eigentliche SI-Basiseinheit ist das Kilogramm'
    }
  }
} ) as const satisfies DerivedUnitDef< typeof gram >;
