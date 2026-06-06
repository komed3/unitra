import type { RegistryFactoryMap, RegistryInstanceMap } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ConstantRef } from '@unitra/types/def/constant';
import type { PrefixRef } from '@unitra/types/def/prefix';
import type { QuantityRef } from '@unitra/types/def/quantity';
import type { UnitRef } from '@unitra/types/def/unit';
import { Registry } from './Registry';

export const createRegistryAccessor = (
  ctx: UnitraContext,
  factories?: Partial< RegistryFactoryMap >
) => {
  const cache: Partial< RegistryInstanceMap > = {};

  const defaults: RegistryFactoryMap = {
    prefix: ( ctx ) => new Registry< PrefixRef >( ctx ),
    quantity: ( ctx ) => new Registry< QuantityRef >( ctx ),
    unit: ( ctx ) => new Registry< UnitRef >( ctx ),
    constant: ( ctx ) => new Registry< ConstantRef >( ctx )
  };
};
