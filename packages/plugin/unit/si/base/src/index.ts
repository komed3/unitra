import type { UnitMap } from '@unitra/types/unit';

import ampereDef, { ampere } from './def/ampere';
import candelaDef, { candela } from './def/candela';
import gramDef, { gram } from './def/gram';
import kelvinDef, { kelvin } from './def/kelvin';
import meterDef, { meter } from './def/meter';
import moleDef, { mole } from './def/mole';
import secondDef, { second } from './def/second';

export default ( {
  [ ampere ]: ampereDef,
  [ candela ]: candelaDef,
  [ gram ]: gramDef,
  [ kelvin ]: kelvinDef,
  [ meter ]: meterDef,
  [ mole ]: moleDef,
  [ second ]: secondDef
} ) as const satisfies UnitMap;
