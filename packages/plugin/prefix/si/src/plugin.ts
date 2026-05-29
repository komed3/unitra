import { plugin } from '@unitra/core/service';
import siPrefixRegistry from './';

plugin.add( {
  id: '@unitra-plugin-prefix-si',
  type: 'prefix',
  requires: [],
  registries: {
    prefix: [ siPrefixRegistry ]
  }
} );
