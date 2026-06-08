import type { PluginDefinition } from '@unitra/types/core/plugin';
import siPrefixRegistry from './';

export default ( {
  id: '@unitra/plugin-prefix-si',
  version: '0.0.1',
  meta: {
    name: 'SI Prefixes',
    description: 'Unitra plugin for SI prefixes',
    tags: [ 'si', 'prefixes' ],
    license: 'MIT',
    author: 'Paul Köhler (komed3)',
    repo: 'https://github.com/komed3/unitra/tree/master/packages/plugin/prefix/si'
  },
  contribs: {
    prefix: [
      siPrefixRegistry
    ]
  }
} ) as const satisfies PluginDefinition;
