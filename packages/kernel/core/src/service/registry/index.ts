import type { IRegistryService } from '@unitra/types/registry';
import { ConstantRegistry } from './ConstantRegistry';
import { PrefixRegistry } from './PrefixRegistry';
import { QuantityRegistry } from './QuantityRegistry';
import { UnitRegistry } from './UnitRegistry';

export const createRegistryService = () : IRegistryService => ( {
  prefix: new PrefixRegistry(),
  quantity: new QuantityRegistry(),
  unit: new UnitRegistry(),
  constant: new ConstantRegistry()
} );

export {
  ConstantRegistry,
  PrefixRegistry,
  QuantityRegistry,
  UnitRegistry
};

