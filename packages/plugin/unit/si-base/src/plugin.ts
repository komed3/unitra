import type { PluginDefinition } from '@unitra/types/plugin';
import siBaseUnitRegistry from './';

export default ( {
  id: '@unitra/plugin-unit-si-base',
  version: '0.0.1',
  meta: {
    name: 'SI Base Units',
    tags: [ 'si', 'units' ]
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
