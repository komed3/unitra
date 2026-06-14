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

// WARMUP

const u = unitra();
const state = u.unit().mul( 'g', { prefix: 'k' } ).mul( 'm' ).div( 's', { prefix: 'u', exp: 2 } ).toObj();
u.parse( 'kilogram meter per microsecond squared' );

// TEST 1 :: INSTANTIATE

let ITERATIONS = 50_000_000;

const s1 = performance.now();
for ( let i = 0; i < ITERATIONS; i++ ) unitra();
const e1 = performance.now();

log( 'TEST 1 :: INSTANTIATE', s1, e1, ITERATIONS );
