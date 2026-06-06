import type { FactoryContainer, FactoryFactoryMap } from '@unitra/types/core/factory';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { createContainer } from '../utils';
import { UnitFactory } from './UnitFactory';

export const createFactoryContainer = (
  ctx: UnitraContext,
  factories?: Partial< FactoryFactoryMap >
) : FactoryContainer =>
  createContainer(
    ctx,
    {
      unit: ctx => new UnitFactory( ctx )
    },
    factories,
    { cache: false }
  );
