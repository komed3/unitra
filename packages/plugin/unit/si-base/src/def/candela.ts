import { Format, Lang, SIType, System } from '@unitra/dict/common';
import { UnitStatus, UnitType } from '@unitra/dict/unit';
import { LuminousIntensityDim } from '@unitra/dim/base';
import { luminousIntensity } from '@unitra/plugin-quantity-base/def/luminousIntensity';
import type { DerivedUnitDef, UnitRef } from '@unitra/types/unit';

export const candela = 'cd' as UnitRef< typeof LuminousIntensityDim, UnitType.NAMED, 'cd' >;

export default ( {
  type: UnitType.NAMED,
  id: candela,
  dim: LuminousIntensityDim,
  structure: [],
  conversion: {
    type: 'identity'
  },
  prefixable: true,
  aliases: [
    'candela',
    'candelas'
  ],
  context: {
    system: [
      System.SI
    ],
    status: UnitStatus.ACTIVE,
    si: SIType.BASE,
    quantities: [
      luminousIntensity
    ]
  },
  meta: {
    symbol: [ {
      id: 'cd',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'cd',
        [ Format.LATEX ]: '\\mathrm{cd}'
      }
    } ],
    name: {
      [ Lang.EN ]: [ 'candela', 'candelas' ],
      [ Lang.DE ]: [ 'Candela' ]
    },
    description: {
      [ Lang.EN ]: 'SI unit of luminous intensity',
      [ Lang.DE ]: 'SI-Basiseinheit der Lichtstärke'
    }
  }
} ) as const satisfies DerivedUnitDef< typeof candela >;
