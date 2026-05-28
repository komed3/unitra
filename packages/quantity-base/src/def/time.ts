import { TimeDim } from '@unitra/dim/base';
import { DerivedQuantityDef, QuantityRef } from '@unitra/types/quantity';

export const time = 'time' as QuantityRef< typeof TimeDim, 'time' >;

export default ( {} ) as const satisfies DerivedQuantityDef< typeof time >;
