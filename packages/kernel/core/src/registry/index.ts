import type { IRegistry, RefOf, RegistryContainer, RegistryFactoryMap, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ConstantRef } from '@unitra/types/def/constant';
import type { PrefixRef } from '@unitra/types/def/prefix';
import type { QuantityRef } from '@unitra/types/def/quantity';
import type { UnitRef } from '@unitra/types/def/unit';
import { createContainer } from '../utils';
import { Registry } from './Registry';

export const createRegistryContainer = (
  ctx: UnitraContext,
  factories?: Partial< RegistryFactoryMap >
) : RegistryContainer =>
  createContainer(
    ctx,
    {
      prefix: ctx => new Registry< PrefixRef >( ctx ),
      quantity: ctx => new Registry< QuantityRef >( ctx ),
      unit: ctx => new Registry< UnitRef >( ctx ),
      constant: ctx => new Registry< ConstantRef >( ctx )
    },
    factories
  );

export const getTypedRegistry = < K extends RegistryKey > ( ctx: UnitraContext, key: K ) =>
  ctx.registry[ key ] as unknown as IRegistry< RefOf< K > >;
