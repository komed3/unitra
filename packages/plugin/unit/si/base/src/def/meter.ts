import { Format, Lang, SIType, System } from '@unitra/dict/common';
import { UnitStatus, UnitType } from '@unitra/dict/unit';
import { LengthDim } from '@unitra/dim/base';
import { length } from '@unitra/plugin-quantity-base/def/length';
import type { DerivedUnitDef, UnitRef } from '@unitra/types/unit';

export const meter = 'm' as UnitRef< typeof LengthDim, UnitType.NAMED, 'm' >;

export default ( {
  type: UnitType.NAMED,
  id: meter,
  dim: LengthDim,
  structure: [],
  conversion: {
    type: 'identity'
  },
  prefixable: true,
  aliases: [
    'meter',
    'meters',
    'metre',
    'metres'
  ],
  context: {
    system: [
      System.SI
    ],
    status: UnitStatus.ACTIVE,
    si: SIType.BASE,
    quantities: [
      length
    ]
  },
  meta: {
    symbol: [ {
      id: 'm',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'm',
        [ Format.LATEX ]: '\\mathrm{m}'
      }
    } ],
    name: {
      [ Lang.EN ]: [ 'meter', 'meters' ],
      [ Lang.DE ]: [ 'Meter' ]
    },
    description: {
      [ Lang.EN ]: 'SI unit of length',
      [ Lang.DE ]: 'SI-Basiseinheit der Länge'
    }
  }
} ) as const satisfies DerivedUnitDef< typeof meter >;
