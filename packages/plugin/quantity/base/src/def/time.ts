import { Format, Lang } from '@unitra/dict/common';
import { Branch } from '@unitra/dict/quantity';
import { TimeDim } from '@unitra/dim/base';
import type { DerivedQuantityDef, QuantityRef } from '@unitra/types/def/quantity';

export const time = 'time' as QuantityRef< typeof TimeDim, 'time' >;

export default ( {
  id: time,
  dim: TimeDim,
  branch: Branch.COMMON,
  meta: {
    symbol: [ {
      id: 't',
      canonical: true,
      format: {
        [ Format.PLAIN ]: 't',
        [ Format.LATEX ]: 't'
      }
    } ],
    name: {
      [ Lang.EN ]: 'time',
      [ Lang.DE ]: 'Zeit'
    },
    description: {
      [ Lang.EN ]: 'quantity expressing the progression of events from the past to the future',
      [ Lang.DE ]: 'Größe, die den Ablauf von Ereignissen von der Vergangenheit bis zur Zukunft ausdrückt'
    }
  }
} ) as const satisfies DerivedQuantityDef< typeof time >;
