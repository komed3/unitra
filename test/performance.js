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

// TEST 2 :: FACTORY

ITERATIONS = 250_000;

const s2 = performance.now();
for ( let i = 0; i < ITERATIONS; i++ ) u.unit().mul( 'g', { prefix: 'k' } ).mul( 'm' ).div( 's', { prefix: 'u', exp: 2 } );
const e2 = performance.now();

log( 'TEST 2 :: FACTORY', s2, e2, ITERATIONS );

// TEST 3 :: SERIALIZE

const s3 = performance.now();
for ( let i = 0; i < ITERATIONS; i++ ) u.serialize( state );
const e3 = performance.now();

log( 'TEST 3 :: SERIALIZE', s3, e3, ITERATIONS );

// TEST 4a :: PLAIN FORMATTER

ITERATIONS = 10_000;

const s4a = performance.now();
for ( let i = 0; i < ITERATIONS; i++ ) u.format( 'plain', state );
const e4a = performance.now();

log( 'TEST 4a :: PLAIN FORMATTER', s4a, e4a, ITERATIONS );

// TEST 4b :: UNICODE FORMATTER

const s4b = performance.now();
for ( let i = 0; i < ITERATIONS; i++ ) u.format( 'unicode', state );
const e4b = performance.now();

log( 'TEST 4b :: UNICODE FORMATTER', s4b, e4b, ITERATIONS );

// TEST 4c :: LATEX FORMATTER

const s4c = performance.now();
for ( let i = 0; i < ITERATIONS; i++ ) u.format( 'latex', state );
const e4c = performance.now();

log( 'TEST 4c :: LATEX FORMATTER', s4c, e4c, ITERATIONS );

// TEST 4d :: TEXT FORMATTER

const s4d = performance.now();
for ( let i = 0; i < ITERATIONS; i++ ) u.format( 'text', state );
const e4d = performance.now();

log( 'TEST 4d :: TEXT FORMATTER', s4d, e4d, ITERATIONS );

// TEST 5a :: PARSER (TEXT)

ITERATIONS = 100_000;

const s5a = performance.now();
for ( let i = 0; i < ITERATIONS; i++ ) u.parse( 'kilogram meter per microsecond squared' );
const e5a = performance.now();

log( 'TEST 5a :: PARSER (TEXT)', s5a, e5a, ITERATIONS );

// TEST 5b :: PARSER (NOTATION)

const s5b = performance.now();
for ( let i = 0; i < ITERATIONS; i++ ) u.parse( 'kg*m/us^2' );
const e5b = performance.now();

log( 'TEST 5b :: PARSER (NOTATION)', s5b, e5b, ITERATIONS );
