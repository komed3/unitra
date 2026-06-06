import type { PluginDefinition } from '@unitra/types/core/plugin';
import siBaseUnitRegistry from './';

export default ( {
  id: '@unitra/plugin-unit-si-base',
  version: '0.0.1',
  meta: {
    name: 'SI Base Units',
    description: 'Unitra plugin for SI base units',
    tags: [ 'si', 'units' ],
    license: 'MIT',
    author: 'Paul Köhler (komed3)',
    repo: 'https://github.com/komed3/unitra/tree/master/packages/plugin/unit/si/base'
  },
  dependencies: {
    '@unitra/plugin-quantity-base': '^0.0.1'
  },
  contributions: {
    units: [
      siBaseUnitRegistry
    ]
  }
} ) as const satisfies PluginDefinition;
