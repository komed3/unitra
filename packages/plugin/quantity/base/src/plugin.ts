import type { PluginDefinition } from '@unitra/types/core/plugin';
import baseQuantityRegistry from './';

export default ( {
  id: '@unitra/plugin-quantity-base',
  version: '0.0.1',
  meta: {
    name: 'Base Quantities',
    description: 'Unitra plugin for SI base quantities',
    tags: [ 'quantities' ],
    license: 'MIT',
    author: 'Paul Köhler (komed3)',
    repo: 'https://github.com/komed3/unitra/tree/master/packages/plugin/quantity/base'
  },
  contributions: {
    quantities: [
      baseQuantityRegistry
    ]
  }
} ) as const satisfies PluginDefinition;
