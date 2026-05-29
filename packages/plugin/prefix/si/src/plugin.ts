import type { PluginDefinition } from '@unitra/types/plugin';

export default ( {
  id: '@unitra/plugin-prefix-si',
  version: '0.0.1',
  meta: {
    name: 'SI Prefixes',
    tags: [ 'si', 'prefixes' ]
  }
} ) as const satisfies PluginDefinition;
