import type { FactoryContainer, FactoryFactoryMap, FactoryInstanceMap, FactoryKey } from '@unitra/types/core/factory';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { UnitFactory } from './UnitFactory';

export const createFactoryContainer = (
  ctx: UnitraContext,
  factories?: Partial< FactoryFactoryMap >
) : FactoryContainer => {
  const defaults: FactoryFactoryMap = {
    unit: ( ctx ) => new UnitFactory( ctx )
  };

  const create = < K extends FactoryKey > ( key: K ) : FactoryInstanceMap[ K ] =>
    ( factories?.[ key ] ?? defaults[ key ] )( ctx );

  return Object.freeze( {
    unit: () => create( 'unit' )
  } );
};
