import type { PluginDefinition } from '@unitra/types/plugin';
import baseQuantityRegistry from './';

export default ( {
  id: '@unitra/plugin-quantity-base',
  version: '0.0.1',
  meta: {
    name: 'Base Quantities',
    tags: [ 'quantities' ]
  },
  contributions: {
    quantities: [
      baseQuantityRegistry
    ]
  }
} ) as const satisfies PluginDefinition;
