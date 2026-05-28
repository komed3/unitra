import type { UnitType } from '@unitra/dict/unit';
import type { Dimension } from './dim';

export type UnitRef<
  D extends Dimension = Dimension,
  T extends UnitType = UnitType,
  S extends string = string
> = S & {
  readonly __brand: 'unit';
  readonly __type: T;
  readonly __dim: D;
};
