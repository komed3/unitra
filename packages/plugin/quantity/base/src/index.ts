import type { QuantityMap } from '@unitra/types/quantity';

import amountOfSubstanceDef, { amountOfSubstance } from './def/amountOfSubstance';
import electricCurrentDef, { electricCurrent } from './def/electricCurrent';
import lengthDef, { length } from './def/length';
import luminousIntensityDef, { luminousIntensity } from './def/luminousIntensity';
import massDef, { mass } from './def/mass';
import temperatureDef, { temperature } from './def/temperature';
import timeDef, { time } from './def/time';

export default ( {
  [ amountOfSubstance ]: amountOfSubstanceDef,
  [ electricCurrent ]: electricCurrentDef,
  [ length ]: lengthDef,
  [ luminousIntensity ]: luminousIntensityDef,
  [ mass ]: massDef,
  [ temperature ]: temperatureDef,
  [ time ]: timeDef
} ) as const satisfies QuantityMap;
