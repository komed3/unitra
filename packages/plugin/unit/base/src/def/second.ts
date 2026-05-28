import { Format, Lang, SIType, System } from '@unitra/dict/common';
import { UnitStatus, UnitType } from '@unitra/dict/unit';
import { TimeDim } from '@unitra/dim/base';
import { time } from '@unitra/quantity-base/def/time';
import type { DerivedUnitDef, UnitRef } from '@unitra/types/unit';

export const second = 's' as UnitRef< typeof TimeDim, UnitType.NAMED, 's' >;

export default ( {
  type: UnitType.NAMED,
  id: second,
  dim: TimeDim,
  structure: [],
  conversion: {
    type: 'identity'
  },
  prefixable: true,
  aliases: [
    'second',
    'seconds',
    'sec'
  ],
  context: {
    system: [
      System.COMMON,
      System.SI
    ],
    status: UnitStatus.ACTIVE,
    si: SIType.BASE,
    quantities: [
      time
    ]
  },
  meta: {
    symbol: [ {
      id: 's',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 's',
        [ Format.LATEX ]: '\\mathrm{s}'
      }
    } ],
    name: {
      [ Lang.EN ]: [ 'second', 'seconds' ],
      [ Lang.DE ]: [ 'Sekunde', 'Sekunden' ]
    },
    description: {
      [ Lang.EN ]: 'SI unit of time',
      [ Lang.DE ]: 'SI-Basiseinheit der Zeit'
    }
  }
} ) as const satisfies DerivedUnitDef< typeof second >;
