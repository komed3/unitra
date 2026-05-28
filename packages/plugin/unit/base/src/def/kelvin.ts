import { Format, Lang, SIType, System } from '@unitra/dict/common';
import { UnitStatus, UnitType } from '@unitra/dict/unit';
import { TemperatureDim } from '@unitra/dim/base';
import { temperature } from '@unitra/quantity-base/def/temperature';
import type { DerivedUnitDef, UnitRef } from '@unitra/types/unit';

export const kelvin = 'K' as UnitRef< typeof TemperatureDim, UnitType.NAMED, 'K' >;

export default ( {
  type: UnitType.NAMED,
  id: kelvin,
  dim: TemperatureDim,
  structure: [],
  conversion: {
    type: 'identity'
  },
  prefixable: true,
  aliases: [
    'kelvin',
    'kelvins'
  ],
  context: {
    system: [
      System.SI
    ],
    status: UnitStatus.ACTIVE,
    si: SIType.BASE,
    quantities: [
      temperature
    ]
  },
  meta: {
    symbol: [ {
      id: 'K',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 'K',
        [ Format.LATEX ]: '\\mathrm{K}'
      }
    }, {
      id: 'degK',
      deprecated: true,
      format: {
        [ Format.PLAIN ]: '°K',
        [ Format.LATEX ]: '\\mathrm{^{\\circ}K}'
      }
    } ],
    name: {
      [ Lang.EN ]: [ 'kelvin', 'kelvins' ],
      [ Lang.DE ]: [ 'Kelvin' ]
    },
    description: {
      [ Lang.EN ]: 'SI unit of thermodynamic temperature',
      [ Lang.DE ]: 'SI-Basiseinheit der thermodynamischen Temperatur'
    }
  }
} ) as const satisfies DerivedUnitDef< typeof kelvin >;
