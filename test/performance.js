import { addPlugins } from '../packages/kernel/core/dist/bootstrap/index.js';
import { unitra } from '../packages/kernel/core/dist/index.js';
import siPrefixPlugin from '../packages/plugin/prefix/si/dist/plugin.js';
import baseQuantityPlugin from '../packages/plugin/quantity/base/dist/plugin.js';
import siBaseUnitPlugin from '../packages/plugin/unit/si/base/dist/plugin.js';

addPlugins(
  siBaseUnitPlugin,
  siPrefixPlugin,
  baseQuantityPlugin
);

const f = n => Intl.NumberFormat( 'en', {
  notation: 'compact',
  compactDisplay: 'long'
} ).format( n );

const log = ( fn, s, e, i ) => console.log(
  '[', fn, ']', f( i ), 'it.', '||', ( e - s ).toFixed( 3 ), 'ms',
  '||', f( i / ( e - s ) * 1000 ), 'ops/s'
);
