import type { PluginDefinition } from '@unitra/types/plugin';
import siPrefixRegistry from './';

export default ( {
  id: '@unitra/plugin-prefix-si',
  version: '0.0.1',
  meta: {
    name: 'SI Prefixes',
    tags: [ 'si', 'prefixes' ]
  },
  contributions: {
    prefixes: [
      siPrefixRegistry
    ]
  }
} ) as const satisfies PluginDefinition;
